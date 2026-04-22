// Setup script: Uses Supabase Management API to create table, policies, and seed data
// Requires SUPABASE_ACCESS_TOKEN env var

const SUPABASE_URL = 'https://bdilsklxylaswursilnl.supabase.co'
const PROJECT_REF = 'bdilsklxylaswursilnl'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkaWxza2x4eWxhc3d1cnNpbG5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwOTcyNiwiZXhwIjoyMDkxNjg1NzI2fQ.0o46A4Acqga5L-oVGmV3ZNmt3-OqkzU4go6prLGgIK0'

const HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const SQL = `
-- Create site_config table
CREATE TABLE IF NOT EXISTS public.site_config (
  id         TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read site_config" ON public.site_config FOR SELECT USING (true);

-- Admin write (using true since the admin API uses service_role)
CREATE POLICY "Admin write site_config" ON public.site_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update site_config" ON public.site_config FOR UPDATE USING (true);
CREATE POLICY "Admin delete site_config" ON public.site_config FOR DELETE USING (true);

-- Storage policies for edcorner-media bucket
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'edcorner-media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'edcorner-media' AND auth.role() = 'service_role');
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE USING (bucket_id = 'edcorner-media' AND auth.role() = 'service_role');
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE USING (bucket_id = 'edcorner-media' AND auth.role() = 'service_role');
`

async function main() {
  console.log('=== Creating table and policies via Management API ===\n')

  // Try using the Supabase Management API to run SQL
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN
  
  if (accessToken) {
    console.log('Using SUPABASE_ACCESS_TOKEN...')
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    })
    const data = await res.text()
    console.log(`Status: ${res.status}`)
    console.log(data)
  } else {
    console.log('⚠️  No SUPABASE_ACCESS_TOKEN found.')
    console.log('')
    console.log('You need to run the SQL manually. Here\'s what to do:')
    console.log('')
    console.log('1. Go to https://supabase.com/dashboard/project/bdilsklxylaswursilnl/sql')
    console.log('2. Paste the SQL below')
    console.log('3. Click Run')
    console.log('')
    console.log('=== SQL START ===')
    console.log(SQL)
    console.log('=== SQL END ===')
  }

  // Seed the site_config data via REST API (only works if table exists)
  console.log('\nSeeding site_config data...')
  const configs = [
    { id: 'hero', value: { dealBadge: '🟢 Completed 50+ brand deals ~ 6 active clients', introName: "Hi, I'm Ed", titleLine1: 'UGC & Tech', titleLine2: 'Creator', copy: 'Your new favourite AI & tech obsessed UGC creator from the UK with 6 years experience in all things product design, marketing & conversion rate optimisation.', ctaLabel: 'Get in touch', ctaHref: '#getintouch' } },
    { id: 'profile', value: { avatarUrl: '', avatarAlt: 'Ed profile' } },
    { id: 'brands', value: { title: 'Proudly working with…', logos: [{ name: 'Limba', src: '' }, { name: 'Pingo', src: '' }, { name: 'Detris', src: '' }, { name: 'Clawbite', src: '' }, { name: 'Airalo', src: '' }] } },
    { id: 'metrics', value: { monthlyViews: '600K+', monthlyViewsLabel: 'Monthly Views' } },
    { id: 'videos', value: { primaryUrl: '', secondaryUrl: '' } },
  ]

  for (const row of configs) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_config`, {
      method: 'POST',
      headers: { ...HEADERS, Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(row),
    })
    console.log(`  ${row.id}: ${res.status === 201 || res.status === 200 ? '✅' : '❌'} (${res.status})`)
    if (res.status >= 300) {
      const text = await res.text()
      console.log(`  ${text}`)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)