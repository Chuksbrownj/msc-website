import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSC — Software Engineering & AI Automation",
  description:
    "MSC is a software engineering company specializing in frontend and backend development, AI automation, workflow automation, data analysis, and API/system integration.",
  keywords: [
    "software engineering",
    "AI automation",
    "workflow automation",
    "data analysis",
    "API integration",
    "custom software",
    "frontend development",
    "backend development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
