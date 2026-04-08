import type { Metadata } from "next";
import { Geist, Golos_Text, Unbounded } from "next/font/google";
import { AppProviders } from "@/shared/providers/AppProviders";
import { siteConfig } from "@/shared/config/site";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
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
    canonical: siteConfig.defaultUrl,
    languages: {
      [siteConfig.locale]: siteConfig.defaultUrl,
    },
  },
  keywords: siteConfig.keywords,
  openGraph: {
    type: "website",
    locale: siteConfig.openGraphLocale,
    url: siteConfig.defaultUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.locale}
      className={[geistSans.variable, golosText.variable, unbounded.variable].join(" ")}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
