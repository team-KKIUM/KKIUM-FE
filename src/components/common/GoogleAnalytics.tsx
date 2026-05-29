'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import * as React from 'react';

import { GA_MEASUREMENT_ID, trackPageView } from '@/lib/analytics';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!isReady || !pathname) return;

    trackPageView(pathname);
  }, [isReady, pathname]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive" onReady={() => setIsReady(true)}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
