'use client'

import { usePathname } from 'next/navigation'
import SiteHeader from '@/components/layout/site-header'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname === '/admin' || pathname === '/login' || pathname.startsWith('/admin/')

  return (
    <>
      {!isAdminRoute ? <SiteHeader /> : null}
      <main>{children}</main>
    </>
  )
}
