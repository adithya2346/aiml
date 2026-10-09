-- =============================================================================
-- RYTHM 2026: SPECTRA Association — Freshers Party
-- Supabase PostgreSQL Database Schema
-- =============================================================================
-- If you wish to run this manually:
-- Go to your Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- (Note: The Node.js server also auto-creates and seeds these tables on startup)
-- =============================================================================

-- 1. Students Registry Table
CREATE TABLE IF NOT EXISTS public.students (
  usn        TEXT PRIMARY KEY NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
  usn          TEXT PRIMARY KEY NOT NULL REFERENCES public.students(usn) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  status       TEXT NOT NULL CHECK(status IN ('yes', 'maybe', 'no')),
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. DJ Song Requests Table
CREATE TABLE IF NOT EXISTS public.songs (
  id           SERIAL PRIMARY KEY,
  usn          TEXT NOT NULL UNIQUE REFERENCES public.students(usn) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  song_name    TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Event Configuration Table
CREATE TABLE IF NOT EXISTS public.event_config (
  key   TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- Indexes for High Performance
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_students_usn ON public.students(usn);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON public.rsvps(status);
CREATE INDEX IF NOT EXISTS idx_songs_usn ON public.songs(usn);

-- -----------------------------------------------------------------------------
-- Seed Initial Students (Skipped if already exist)
-- -----------------------------------------------------------------------------
INSERT INTO public.students (usn, name) VALUES
  ('1XX22CS001', 'Aarav Sharma'),
  ('1XX22CS002', 'Priya Nandakumar'),
  ('1XX22CS003', 'Rohan Deshmukh'),
  ('1XX22CS004', 'Sneha Kulkarni'),
  ('1XX22CS005', 'Aditya Hegde'),
  ('1XX22CS006', 'Meera Iyer'),
  ('1XX22CS007', 'Farhan Akhtar'),
  ('1XX22CS008', 'Tanya Sengupta'),
  ('1XX22CS009', 'Varun Tej'),
  ('1XX22CS010', 'Ananya Nair')
ON CONFLICT (usn) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Seed Default Event Configuration
-- -----------------------------------------------------------------------------
INSERT INTO public.event_config (key, value) VALUES
  ('name', '"RYTHM: Freshers 2026"'),
  ('tagline', '"Organized by SPECTRA Association • Dept. of Artificial Intelligence and Machine Learning"'),
  ('targetDate', '"2026-10-13T09:30:00"'),
  ('displayDate', '"13 October 2026"'),
  ('displayTime', '"9:30 AM onwards"'),
  ('venueName', '"Party Hall, Room No. 332"'),
  ('venueShort', '"Party Hall (Room 332)"'),
  ('googleMapsUrl', '"https://maps.google.com/?q=Party+Hall"'),
  ('dressCode', '"Retro Arcade / Cyber Chic"'),
  ('department', '"Dept. of Artificial Intelligence and Machine Learning"'),
  ('college', '"SPECTRA Association"')
ON CONFLICT (key) DO NOTHING;
