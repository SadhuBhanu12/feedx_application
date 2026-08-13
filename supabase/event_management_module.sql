-- 1. Redefine public.events table structure safely
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    event_date TEXT,
    time TEXT,
    image_url TEXT,
    location TEXT DEFAULT 'Offline', -- Offline, Online, Hybrid
    venue TEXT,
    price NUMERIC DEFAULT 0,
    category TEXT DEFAULT 'Workshop',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE
);

-- Ensure all required columns are added to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_by_role TEXT DEFAULT 'admin';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS branch_eligibility TEXT DEFAULT 'All';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS academic_year_eligibility TEXT DEFAULT 'All';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_start TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_end TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS certificate_available BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS attendance_required BOOLEAN DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Published'; -- Draft, Published, Closed, Cancelled
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'Global'; -- Global, College, Branch, Year
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Clean recreate public.event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    registration_number TEXT NOT NULL UNIQUE,
    qr_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    status TEXT DEFAULT 'Registered', -- Registered, Cancelled
    attendance TEXT DEFAULT 'Pending', -- Pending, Present, Absent
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    certificate_status TEXT DEFAULT 'Not Eligible', -- Not Eligible, Eligible, Issued
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, event_id)
);

-- Ensure user_id column exists
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS attendance TEXT DEFAULT 'Pending';
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS certificate_status TEXT DEFAULT 'Not Eligible';

-- 3. Create qr_verifications table (scan logging)
CREATE TABLE IF NOT EXISTS public.qr_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verification_time TIMESTAMPTZ DEFAULT NOW(),
    scan_result TEXT DEFAULT 'Success' -- Success, Failed, Duplicate
);

-- 4. Enable RLS and Grant DML permissions
GRANT ALL ON public.events TO authenticated, anon, service_role;
GRANT ALL ON public.event_registrations TO authenticated, anon, service_role;
GRANT ALL ON public.qr_verifications TO authenticated, anon, service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_verifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Read events all" ON public.events;
CREATE POLICY "Read events all" ON public.events
    FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Manage events admin" ON public.events;
CREATE POLICY "Manage events admin" ON public.events
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'inst_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Read own registrations" ON public.event_registrations;
CREATE POLICY "Read own registrations" ON public.event_registrations
    FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Register for events" ON public.event_registrations;
CREATE POLICY "Register for events" ON public.event_registrations
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Cancel own registrations" ON public.event_registrations;
CREATE POLICY "Cancel own registrations" ON public.event_registrations
    FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Manage registrations admin" ON public.event_registrations;
CREATE POLICY "Manage registrations admin" ON public.event_registrations
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'inst_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "View qr verifications admin" ON public.qr_verifications;
CREATE POLICY "View qr verifications admin" ON public.qr_verifications
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'inst_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Create qr verifications admin" ON public.qr_verifications;
CREATE POLICY "Create qr verifications admin" ON public.qr_verifications
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'inst_admin', 'admin')
        )
    );

-- 6. Publication Trigger & Functions
CREATE OR REPLACE FUNCTION public.on_event_published_notify()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Published' AND (OLD.status IS NULL OR OLD.status <> 'Published') THEN
    INSERT INTO public.notifications (title, message, type, branch, year, college_id)
    VALUES (
      'New Event: ' || NEW.title,
      'A new event "' || NEW.title || '" is available at ' || NEW.venue || ' on ' || NEW.event_date || '.',
      'Event',
      COALESCE(NEW.branch_eligibility, 'All'),
      COALESCE(NEW.academic_year_eligibility, 'All'),
      NEW.college_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_event_published ON public.events;
CREATE TRIGGER tr_on_event_published
AFTER INSERT OR UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.on_event_published_notify();
