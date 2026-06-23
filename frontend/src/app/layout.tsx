import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CurrentYear from "@/components/CurrentYear";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { fetchMetadataForPath } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans scroll-smooth`} suppressHydrationWarning>
      <body className="bg-[#FAFAFA] text-[#18181B] min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        {/* Schema.org Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BAGPACKERS AI Platform",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Bagpackers Developers",
                "url": "https://bagpackers.dev"
              }
            })
          }}
        />
        
        {/* Google Analytics 4 Script (Hydration and Telemetry Safe) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TELEMETRY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-TELEMETRY', {
              send_page_view: true
            });
          `}
        </Script>

        <Navbar />
        <main className="flex-1">{children}</main>
        
        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#09090B] py-8 px-6 text-center text-xs text-zinc-500">
          <p>© <CurrentYear /> Bagpackers Developers. All rights reserved. Platform Class: Confidential Enterprise Codebase.</p>
        </footer>
      </body>
    </html>
  );
}

