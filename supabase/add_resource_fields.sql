-- FEEDX DATABASE MIGRATION: RESOURCES COLUMNS & PERFORMANCE INDEXES
-- Run this in your Supabase SQL Editor to support advanced resource filtering and searching.

-- 1. Add fields to resources table (if they do not already exist)
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS regulation TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS semester TEXT;

-- 2. Populate fallback data for text columns from foreign tables if possible, otherwise set defaults
UPDATE public.resources r
SET 
  subject = COALESCE(r.subject, (SELECT subject_name FROM public.subjects s WHERE s.id = r.subject_id), 'General'),
  branch = COALESCE(r.branch, (SELECT branch_name FROM public.branches b WHERE b.id = r.branch_id), 'All'),
  year = COALESCE(r.year, (SELECT year_name FROM public.academic_years a WHERE a.id = r.academic_year_id), 'All'),
  section = COALESCE(r.section, 'All'),
  resource_type = COALESCE(r.resource_type, r.type, 'Notes'),
  regulation = COALESCE(r.regulation, 'All'),
  semester = COALESCE(r.semester, (SELECT semester FROM public.academic_years a WHERE a.id = r.academic_year_id), 'All')
WHERE r.subject IS NULL OR r.branch IS NULL OR r.year IS NULL OR r.resource_type IS NULL;

-- 3. Create performance indexes for resource lookups and filters
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_title ON public.resources(title);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_regulation ON public.resources(regulation);
CREATE INDEX IF NOT EXISTS idx_resources_semester ON public.resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_branch ON public.resources(branch);
