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

        {/* Cal.com — single load, used by header button and contact section inline widget */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(e,a,t){function n(){var s=e[a].ns[t];s&&s.ui&&s.ui({cssVarsPerTheme:{light:{calBrand:"#CCFF00"}},"hideEventTypeDetails":!1,layout:"month_view"})}var r=function(s,i){s.q.push(i)};var c=e.document;e[a]=e[a]||function(){var s=e[a],i=arguments;if(!s.loaded){s.ns={};s.q=s.q||[];c.head.appendChild(c.createElement("script")).src=arguments[1];s.loaded=!0}i[0]===t?(function(){var o=function(){r(o,arguments)};var l=i[1];o.q=o.q||[];"string"==typeof l?(s.ns[l]=s.ns[l]||{},r(s.ns[l],i),r(s,[t,l])):r(s,i)})():r(s,i)}};e[a].q=e[a].q||[]})(window,"Cal","init");Cal("init","30min",{origin:"https://app.cal.com"});Cal.ns["30min"]("inline",{elementOrSelector:"#my-cal-inline-30min",config:{layout:"month_view",useSlotsViewOnSmallScreen:"true"},calLink:"edcorner/30min"});Cal.ns["30min"]("ui",{cssVarsPerTheme:{light:{calBrand:"#CCFF00"}},"hideEventTypeDetails":false,layout:"month_view"});`,
          }}
        />
      </body>
    </html>
  )
}
