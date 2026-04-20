import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const VIDEO_BASE_COLUMNS = [
  'id',
  'url',
  'category',
  'title',
  'caption',
  'uploaded_at',
  'featured',
  'sort_order',
  'storage_path',
] as const

export type DbVideo = {
  id: string
  url: string
  category: string
  title: string | null
  caption: string | null
  uploaded_at: string
  featured: boolean
  sort_order: number
  storage_path?: string | null
}

export async function getVideosByCategory(): Promise<Record<string, DbVideo[]>> {
  const { data, error } = await supabase
    .from('videos')
    .select(VIDEO_BASE_COLUMNS.join(','))
    .order('sort_order', { ascending: true })
    .order('uploaded_at', { ascending: false })

  if (error || !data) return {}

  const videos = data as unknown as DbVideo[]

  const result: Record<string, DbVideo[]> = {}
  for (const video of videos) {
    if (!result[video.category]) result[video.category] = []
    result[video.category].push(video)
  }
  return result
}

export async function getAllVideos(): Promise<DbVideo[]> {
  const { data, error } = await supabase
    .from('videos')
    .select(VIDEO_BASE_COLUMNS.join(','))
    .order('sort_order', { ascending: true })
    .order('uploaded_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as DbVideo[]
}
