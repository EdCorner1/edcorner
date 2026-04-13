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

        {/* Cal.com booking embed */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || {};
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else {
        p(cal, ar);
      }
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "30min", { origin: "https://app.cal.com" });
Cal.ns["30min"]("ui", {
  "cssVarsPerTheme": { "light": { "cal-brand": "#CCFF00" } },
  "hideEventTypeDetails": false,
  "layout": "month_view"
});
            `,
          }}
        />
      </body>
    </html>
  )
}
