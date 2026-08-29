import type { Metadata, Viewport } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MSC — Software Engineering, AI & Automation",
    template: "%s | MSC",
  },
  description:
    "MSC builds modern software, AI-powered solutions, automated workflows, and data-driven systems for businesses.",
  keywords: [
    "software engineering",
    "AI automation",
    "workflow automation",
    "data analysis",
    "API integration",
    "custom software",
  ],
  authors: [{ name: "MSC" }],
  creator: "MSC",
  publisher: "MSC",
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: "MSC — Software Engineering, AI & Automation",
    description:
      "MSC builds modern software, AI-powered solutions, automated workflows, and data-driven systems for businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MSC — Software Engineering, AI & Automation",
    description:
      "MSC builds modern software, AI-powered solutions, automated workflows, and data-driven systems for businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
