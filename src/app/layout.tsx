import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import SiteHeader from '@/components/layout/site-header'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Ed Corner — UGC & Tech Creator',
  description: 'UGC and creator-led content for tech, AI and SaaS brands. 6 years experience in product design, marketing and conversion rate optimisation.',
  openGraph: {
    title: 'Ed Corner — UGC & Tech Creator',
    description: 'UGC and creator-led content for tech, AI and SaaS brands.',
    type: 'website',
    siteName: 'Ed Corner',
    images: [{
      url: 'https://edcorner.co.uk/wp-content/uploads/2026/04/ed-corner-og.jpg',
      width: 1200,
      height: 630,
      alt: 'Ed Corner — UGC & Tech Creator',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ed Corner — UGC & Tech Creator',
    description: 'UGC and creator-led content for tech, AI and SaaS brands.',
    creator: '@DefinitelyEd',
    images: ['https://edcorner.co.uk/wp-content/uploads/2026/04/ed-corner-og.jpg'],
  },
  icons: {
    icon: 'https://edcorner.co.uk/wp-content/uploads/2026/03/cropped-Untitled-design-6.png',
    shortcut: 'https://edcorner.co.uk/wp-content/uploads/2026/03/cropped-Untitled-design-6.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={bricolage.variable}>
        <SiteHeader />
        <main>{children}</main>
        <SpeedInsights />

        {/* Cal.com embed — enables header button (data-cal-link) and contact section inline widget */}
        <script
          id="cal-embed-script"
          src="https://app.cal.com/embed/embed.js"
          async
        />
      </body>
    </html>
  )
}
