import FullAdminCms from '@/components/admin/full-admin-cms'
import { requireAdminPageAuth } from '@/lib/admin-auth'
import { getAllVideos, getAllSiteConfig } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdminPageAuth()

  let videos: Awaited<ReturnType<typeof getAllVideos>> = []
  let config: Awaited<ReturnType<typeof getAllSiteConfig>> = {}

  try {
    ;[videos, config] = await Promise.all([
      getAllVideos(),
      getAllSiteConfig(),
    ])
  } catch (error) {
    console.error('Failed to load admin data:', error)
  }

  return <FullAdminCms initialVideos={videos} initialConfig={config} />
}