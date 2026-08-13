-- Backfill missing qr_tokens for any existing registrations that were created before the column default was added
UPDATE public.event_registrations 
SET qr_token = gen_random_uuid() 
WHERE qr_token IS NULL;

-- Reload schema just in case
NOTIFY pgrst, 'reload schema';
