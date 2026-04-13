import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DbVideo = {
  id: string
  url: string
  category: string
  title: string | null
  caption: string | null
  uploaded_at: string
  featured: boolean
  sort_order: number
}

export async function getVideosByCategory(): Promise<Record<string, DbVideo[]>> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) return {}

  const result: Record<string, DbVideo[]> = {}
  for (const video of data as DbVideo[]) {
    if (!result[video.category]) result[video.category] = []
    result[video.category].push(video)
  }
  return result
}

export async function getAllVideos(): Promise<DbVideo[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data as DbVideo[]
}

export async function getTickerVideos(count = 9): Promise<string[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('url')
    .order('featured', { ascending: false })
    .limit(count)

  if (error || !data) return []
  return (data as { url: string }[]).map(v => v.url)
}
