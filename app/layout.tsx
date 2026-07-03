import type { Metadata } from "next";
import Script from "next/script";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants/site";
import { getPublicEnv } from "@/lib/env";
import "./globals.css";

const publicEnv = getPublicEnv();
const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl;
const googleAnalyticsId = publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}