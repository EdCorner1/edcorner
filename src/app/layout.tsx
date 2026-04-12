import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import SiteHeader from '@/components/layout/site-header'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Ed Corner — UGC for tech, AI & travel brands',
  description: 'UGC and creator-led content for tech, AI and SaaS brands that want stronger creative.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={bricolage.variable}>
        <SiteHeader />
        <main>{children}</main>
        <footer className="py-6 px-8 border-t border-[#e8e8e4] mt-20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-bold text-[#333]">Ed Corner</span>
            <p className="text-xs text-[#9a9a9a]">© 2025 Ed Corner. UGC & creator-led content for tech, AI and SaaS brands.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}