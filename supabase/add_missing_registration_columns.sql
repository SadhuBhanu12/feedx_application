-- Add missing columns to event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS registration_number TEXT UNIQUE;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS qr_token UUID UNIQUE DEFAULT gen_random_uuid();
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Registered';
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS attendance_status TEXT DEFAULT 'Not Checked In';

-- Reload schema
NOTIFY pgrst, 'reload schema';
