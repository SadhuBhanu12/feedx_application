-- Add all missing columns from the base schema that weren't in the original ALTER statements
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_date TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Offline';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Workshop';

-- And reload the PostgREST cache immediately
NOTIFY pgrst, 'reload schema';
