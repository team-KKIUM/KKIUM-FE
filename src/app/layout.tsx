import type { Metadata } from 'next';
import { AppShell } from '@/components/common/AppShell';
import { GoogleAnalytics } from '@/components/common/GoogleAnalytics';
import { nanumSquare } from './fonts';
import { Providers } from './providers';
import './globals.css';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kkium.com').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KKIUM',
    template: '%s | KKIUM',
  },
  description: "당신의 경험이 제자리를 찾는 방식",
  openGraph: {
    siteName: 'KKIUM',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${nanumSquare.className} h-full antialiased`}>
      <body className="min-h-full">
        <GoogleAnalytics />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
