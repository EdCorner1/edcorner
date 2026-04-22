-- ============================================================
-- Ed Corner Site — Storage Buckets + CMS Tables
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create storage bucket for all media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'edcorner-media',
  'edcorner-media',
  true,
  52428800, -- 50MB max per file
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- 2. Storage policies — anyone can read, only admin service role can write
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'edcorner-media');

CREATE POLICY "Admin upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'edcorner-media' AND auth.role() = 'service_role');

CREATE POLICY "Admin update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'edcorner-media' AND auth.role() = 'service_role');

CREATE POLICY "Admin delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'edcorner-media' AND auth.role() = 'service_role');

-- 3. Create site_config table for all editable site content
CREATE TABLE IF NOT EXISTS public.site_config (
  id         TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_config"
  ON public.site_config FOR SELECT
  USING (true);

CREATE POLICY "Admin write site_config"
  ON public.site_config FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update site_config"
  ON public.site_config FOR UPDATE
  USING (true);

CREATE POLICY "Admin delete site_config"
  ON public.site_config FOR DELETE
  USING (true);

-- 4. Seed default site_config values
INSERT INTO public.site_config (id, value) VALUES
  ('hero', '{
    "dealBadge": "🟢 Completed 50+ brand deals ~ 6 active clients",
    "introName": "Hi, I''m Ed",
    "titleLine1": "UGC & Tech",
    "titleLine2": "Creator",
    "copy": "Your new favourite AI & tech obsessed UGC creator from the UK with 6 years experience in all things product design, marketing & conversion rate optimisation.",
    "ctaLabel": "Get in touch",
    "ctaHref": "#getintouch"
  }'),
  ('profile', '{
    "avatarUrl": "",
    "avatarAlt": "Ed profile"
  }'),
  ('brands', '{
    "title": "Proudly working with…",
    "logos": []
  }'),
  ('metrics', '{
    "monthlyViews": "600K+",
    "monthlyViewsLabel": "Monthly Views"
  }'),
  ('videos', '{
    "primaryUrl": "",
    "secondaryUrl": ""
  }')
ON CONFLICT (id) DO NOTHING;