import type { Metadata } from 'next'
import Script from 'next/script'
import { Bricolage_Grotesque } from 'next/font/google'
import AppShell from '@/components/layout/app-shell'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Ed Corner — UGC & Tech Creator',
  description:
    'UGC and creator-led content for tech, AI and SaaS brands. 6 years experience in product design, marketing and conversion rate optimisation.',
  openGraph: {
    title: 'Ed Corner — UGC & Tech Creator',
    description: 'UGC and creator-led content for tech, AI and SaaS brands.',
    type: 'website',
    siteName: 'Ed Corner',
    images: [
      {
        url: 'https://edcorner.co.uk/wp-content/uploads/2026/04/ed-corner-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Ed Corner — UGC & Tech Creator',
      },
    ],
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
        <AppShell>{children}</AppShell>
        <SpeedInsights />
        <Analytics />

        <Script id="cal-com-loader" strategy="afterInteractive">
          {`
            (function (C, A, L) {
              let p = function (a, ar) { a.q.push(ar); };
              let d = C.document;
              C.Cal = C.Cal || function () {
                let cal = C.Cal;
                let ar = arguments;
                if (!cal.loaded) {
                  cal.ns = {};
                  cal.q = cal.q || [];
                  d.head.appendChild(d.createElement('script')).src = A;
                  cal.loaded = true;
                }
                if (ar[0] === L) {
                  const api = function () { p(api, arguments); };
                  const namespace = ar[1];
                  api.q = api.q || [];
                  if (typeof namespace === 'string') {
                    cal.ns[namespace] = cal.ns[namespace] || api;
                    p(cal.ns[namespace], ar);
                    p(cal, ['initNamespace', namespace]);
                  } else {
                    p(cal, ar);
                  }
                  return;
                }
                p(cal, ar);
              };
            })(window, 'https://app.cal.com/embed/embed.js', 'init');
            Cal('init', '30min', { origin: 'https://app.cal.com' });
            Cal.ns['30min']('ui', { hideEventTypeDetails: false, layout: 'month_view' });
          `}
        </Script>
      </body>
    </html>
  )
}
