import VideoCms from '@/components/admin/video-cms'
import { requireAdminPageAuth } from '@/lib/admin-auth'
import { getAllVideos } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdminPageAuth()

  const videos = await getAllVideos()

  return <VideoCms initialVideos={videos} />
}
