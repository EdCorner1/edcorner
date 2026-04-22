import FullAdminCms from '@/components/admin/full-admin-cms'
import { requireAdminPageAuth } from '@/lib/admin-auth'
import { getAllVideos, getAllSiteConfig } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdminPageAuth()

  const [videos, config] = await Promise.all([
    getAllVideos(),
    getAllSiteConfig(),
  ])

  return <FullAdminCms initialVideos={videos} initialConfig={config} />
}