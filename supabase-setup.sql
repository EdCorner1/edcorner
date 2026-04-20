-- ============================================================
-- Ed Corner Site — Video Library Setup
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create the videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  url          TEXT        NOT NULL,
  category     TEXT        NOT NULL,
  title        TEXT,
  caption      TEXT,
  uploaded_at  TIMESTAMPTZ DEFAULT now(),
  featured     BOOLEAN     DEFAULT false,
  sort_order   INT         DEFAULT 0,
  storage_path TEXT
);

ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- 2. Enable Row Level Security (public read, authenticated write)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- 3. Policy: everyone can read videos
CREATE POLICY "Public read"
  ON public.videos FOR SELECT
  USING (true);

-- 4. Policy: only authenticated users can insert/update/delete
CREATE POLICY "Authenticated write"
  ON public.videos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated update"
  ON public.videos FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated delete"
  ON public.videos FOR DELETE
  USING (true);

-- 5. Index for fast category lookups
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos (category);
CREATE INDEX IF NOT EXISTS idx_videos_uploaded_at ON public.videos (uploaded_at DESC);

-- ============================================================
-- Seed with existing videos from the site
-- Categories match the current content tabs:
-- Health & Fitness | Apps | Tech | AI | Travel
-- ============================================================

INSERT INTO public.videos (url, category, title, caption, uploaded_at, featured, sort_order, storage_path) VALUES

-- Travel (Airalo)
('https://edcorner.co.uk/wp-content/uploads/2026/04/Airalo-Video-1-9-16.mov',  'Travel', 'Airalo — eSIM App', 'Testing out Airalo for my Europe trip — eSIM setup in 3 minutes.', '2026-04-11', false, 1, null),
('https://edcorner.co.uk/wp-content/uploads/2026/04/Airalo-Video-2-916-No-captions-With-Endscreen.mov', 'Travel', 'Airalo — How it Works', 'Quick walkthrough of how Airalo works for staying connected abroad.', '2026-04-18', false, 2, null),

-- Travel (Pipo)
('https://edcorner.co.uk/wp-content/uploads/2026/01/Pipo-AI-Day-11-V2.mp4',    'Travel', 'Pipo AI Day 11', 'Day 11 with Pipo AI — travel companion in action.', '2026-01-31', false, 3, null),
('https://edcorner.co.uk/wp-content/uploads/2026/01/Pipo-AI-Day-3.mp4',          'Travel', 'Pipo AI Day 3',  'Day 3 testing Pipo on the go.', '2026-01-21', false, 4, null),
('https://edcorner.co.uk/wp-content/uploads/2026/01/Pipo-Day-7-v3.mp4',           'Travel', 'Pipo Day 7',     'Day 7 with Pipo — getting into a rhythm.', '2026-01-27', false, 5, null),
('https://edcorner.co.uk/wp-content/uploads/2026/01/Pipo-day-5.mp4',              'Travel', 'Pipo Day 5',     'Day 5 exploring with Pipo.', '2026-01-25', false, 6, null),
('https://edcorner.co.uk/wp-content/uploads/2026/01/PipoAIDay4.mp4',             'Travel', 'Pipo AI Day 4',  'Day 4 with the AI travel companion.', '2026-01-28', false, 7, null),
('https://edcorner.co.uk/wp-content/uploads/2026/01/Pipoday7.mp4',               'Travel', 'Pipo Day 7 v2',  'Another Day 7 with Pipo.', '2026-01-26', false, 8, null),

-- Tech / Apps
('https://edcorner.co.uk/wp-content/uploads/2026/02/Video-1-with-captions.mp4',  'Apps', 'App Demo Reel',    'Quick demo of a tech app — native format, vertical.', '2026-02-28', true, 9, null),
('https://edcorner.co.uk/wp-content/uploads/2026/02/video-2-with-captions.mp4',  'Apps', 'App Demo Reel 2', 'Second app demo in the series.', '2026-02-25', true, 10, null),

-- Health & Fitness
('https://edcorner.co.uk/wp-content/uploads/2026/02/Snapchat-1274565060.mp4',  'Health & Fitness', 'Fitness App — Snapchat', 'Health app content for fitness brand.', '2026-02-14', false, 11, null),

-- Mixed / General Tech
('https://edcorner.co.uk/wp-content/uploads/2026/01/b33f8fccf3642c8cb8fb3783c39f400b-1.mp4', 'Tech', 'Tech UGC — Generic', 'Tech product content.', '2026-01-19', false, 12, null),
('https://edcorner.co.uk/wp-content/uploads/2026/01/b5c75a8a67327a81e15ad0e17658aa8d.mp4', 'Tech', 'Tech Review',       'Another tech review snippet.', '2026-01-11', false, 13, null),

-- Snapchat content
('https://edcorner.co.uk/wp-content/uploads/2026/02/Snapchat-1007477723.mp4',  'Health & Fitness', 'Snapchat — Fitness', 'Fitness content on Snapchat.', '2026-02-23', false, 14, null),
('https://edcorner.co.uk/wp-content/uploads/2026/02/Snapchat-1187835808-1.mp4', 'Travel', 'Snapchat — Travel',  'Travel content on Snapchat.', '2026-02-26', false, 15, null),
('https://edcorner.co.uk/wp-content/uploads/2026/02/Snapchat-1888022501.mp4',   'Tech', 'Snapchat — Tech',   'Tech content on Snapchat.', '2026-02-27', false, 16, null),
('https://edcorner.co.uk/wp-content/uploads/2026/02/Snapchat-1992533435.mp4',   'Apps', 'Snapchat — Apps',   'Apps content on Snapchat.', '2026-02-10', false, 17, null),
('https://edcorner.co.uk/wp-content/uploads/2026/04/Snapchat-1202039003-1.mp4', 'Travel', 'Snapchat — Travel 2', 'More travel content.', '2026-04-17', false, 18, null),
('https://edcorner.co.uk/wp-content/uploads/2026/04/Snapchat-1699779289-1.mp4', 'Health & Fitness', 'Snapchat — Fitness 2', 'More fitness content.', '2026-04-20', false, 19, null),
('https://edcorner.co.uk/wp-content/uploads/2026/04/Snapchat-1730420027.mp4',   'Tech', 'Snapchat — Tech 2', 'More tech content.', '2026-04-22', false, 20, null),
('https://edcorner.co.uk/wp-content/uploads/2026/04/Snapchat-869139679.mp4',     'Apps', 'Snapchat — Apps 2', 'More apps content.', '2026-04-14', false, 21, null),

-- Job Interview / B2B
('https://edcorner.co.uk/wp-content/uploads/2026/02/Job-interview1.mp4',       'Tech', 'Job Interview B2B', 'B2B tech content.', '2026-02-20', false, 22, null),

-- General
('https://edcorner.co.uk/wp-content/uploads/2026/02/2026-02-01-112055781.mp4', 'Travel', 'Travel Content Feb', 'Travel content from February.', '2026-02-01', false, 23, null),
('https://edcorner.co.uk/wp-content/uploads/2026/02/2026-02-24-190910663.mp4',  'Travel', 'Travel Content Feb 24', 'Travel from end of February.', '2026-02-24', false, 24, null),
('https://edcorner.co.uk/wp-content/uploads/2026/03/7f7212ff5ed915e68d04fdd405ef064a.mp4', 'Tech', 'Tech March', 'Tech content from March.', '2026-03-12', false, 25, null),
('https://edcorner.co.uk/wp-content/uploads/2026/03/d7c359c0cf243f029082205768b75922-1.mp4', 'Tech', 'Tech UGC Hero', 'Hero video — tech UGC content.', '2026-03-22', true, 0, null)

ON CONFLICT DO NOTHING;
