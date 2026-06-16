import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import { siteConfig } from "@/config/city";
import { Providers } from "@/components/Providers";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Worcester, MA`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Your editorial guide to New England's finest towns.",
  openGraph: {
    title: siteConfig.name,
    description: "Your editorial guide to New England's finest towns.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${dmSans.variable} ${cormorantGaramond.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f5efe6] font-sans text-stone-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
