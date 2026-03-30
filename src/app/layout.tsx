import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";

import { ToasterProvider } from "@/components/toaster-provider";
import { absoluteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const headlineFont = localFont({
  display: "swap",
  src: [
    {
      path: "./fonts/ABCGintoNord-Black-Trial-BF651b7b7719b0f.otf",
      style: "normal",
      weight: "900",
    },
  ],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 2598,
        height: 1568,
        alt: "Bolda waitlist landing page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sameAs = Object.values(siteConfig.social).filter((link) => link.startsWith("http"));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        potentialAction: {
          "@type": "JoinAction",
          target: absoluteUrl("/"),
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body className={`${bodyFont.className} ${headlineFont.variable}`}>
        {children}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
        <ToasterProvider />
      </body>
    </html>
  );
}
