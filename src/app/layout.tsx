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
  title: 'Ed Corner — UGC & Tech Creator',
  description: 'UGC and creator-led content for tech, AI and SaaS brands.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={bricolage.variable}>
        <SiteHeader />
        <main>{children}</main>
        <footer
          style={{
            borderTop: '1px solid #e8e8e4',
            marginTop: 40,
            padding: '22px 18px',
            background: '#fff',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <strong style={{ color: '#333' }}>Ed Corner</strong>
            <p style={{ color: '#8e8e8e', margin: 0, fontSize: 12 }}>
              © 2026 Ed Corner. UGC & creator-led content for tech, AI and SaaS brands.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
