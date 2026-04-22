import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { YandexMetrika } from "@/shared/ui/analytics/YandexMetrika";
import { buildSiteUrl, siteConfig } from "@/shared/config/site";
import { AppProviders } from "@/shared/providers/AppProviders";
import { buildCanonicalUrl } from "@/shared/seo";
import "./globals.scss";

const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOI4nQ.ttf", weight: "100", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RHOM4nQ.ttf", weight: "200", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RwuM4nQ.ttf", weight: "300", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4nQ.ttf", weight: "400", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RruM4nQ.ttf", weight: "500", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nQ.ttf", weight: "600", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_Re-Q4nQ.ttf", weight: "700", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RHOQ4nQ.ttf", weight: "800", style: "normal" },
    { path: "../shared/assets/fonts/geist/gyBhhwUxId8gMGYQMKR3pzfaWI_RNeQ4nQ.ttf", weight: "900", style: "normal" },
  ],
});

const golosText = localFont({
  variable: "--font-golos-text",
  display: "swap",
  src: [
    { path: "../shared/assets/fonts/golos-text/q5uXsoe9Lv5t7Meb31EcOR9UdVTNs822plVRRQ5c.ttf", weight: "400", style: "normal" },
    { path: "../shared/assets/fonts/golos-text/q5uXsoe9Lv5t7Meb31EcOR9UdVTNs822plVjRQ5c.ttf", weight: "500", style: "normal" },
    { path: "../shared/assets/fonts/golos-text/q5uXsoe9Lv5t7Meb31EcOR9UdVTNs822plWPQg5c.ttf", weight: "600", style: "normal" },
    { path: "../shared/assets/fonts/golos-text/q5uXsoe9Lv5t7Meb31EcOR9UdVTNs822plW2Qg5c.ttf", weight: "700", style: "normal" },
    { path: "../shared/assets/fonts/golos-text/q5uXsoe9Lv5t7Meb31EcOR9UdVTNs822plXRQg5c.ttf", weight: "800", style: "normal" },
    { path: "../shared/assets/fonts/golos-text/q5uXsoe9Lv5t7Meb31EcOR9UdVTNs822plX4Qg5c.ttf", weight: "900", style: "normal" },
  ],
});

const geologica = localFont({
  variable: "--font-geologica",
  display: "swap",
  src: [
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqDx_qQ-M.ttf", weight: "100", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqD5_rQ-M.ttf", weight: "200", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqD0HrQ-M.ttf", weight: "300", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqDx_rQ-M.ttf", weight: "400", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqDy3rQ-M.ttf", weight: "500", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqD8HsQ-M.ttf", weight: "600", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqD_jsQ-M.ttf", weight: "700", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqD5_sQ-M.ttf", weight: "800", style: "normal" },
    { path: "../shared/assets/fonts/geologica/oY1o8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckU8H3G11_z-_OZqD7bsQ-M.ttf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.defaultUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
  alternates: {
    canonical: buildCanonicalUrl("/"),
    languages: {
      [siteConfig.locale]: buildSiteUrl("/"),
    },
  },
  keywords: siteConfig.keywords,
  openGraph: {
    type: "website",
    locale: siteConfig.openGraphLocale,
    url: buildSiteUrl("/"),
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.locale}
      className={[geistSans.variable, golosText.variable, geologica.variable].join(" ")}
    >
      <body>
        <YandexMetrika />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
