import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Script from "next/script";
import { AuthProvider } from "@/lib/useAuth";
import Footer from "@/components/Footer";
import "./globals.css";

// Metadata (SEO + OG + Social)
export const metadata: Metadata = {
  metadataBase: new URL('https://resume.nexxgennhustle.com'),
  title: "Trade Hustle Resume Builder",
  description:
    "ATS-optimized trade resumes powered by Enhanced Intelligence. Built for the trade. Backed by Hustle.",
  icons: {
    icon: "/favicon.ico", // drop your favicon into /public
  },
  openGraph: {
    title: "Trade Hustle Resume Builder",
    description:
      "Turn ambition into income. ATS-optimized trade resumes built for the grind, powered by Enhanced Intelligence.",
    url: "https://resume.nexxgennhustle.com",
    siteName: "Trade Hustle",
    images: [
      {
        url: "/assets/resumeBuilderLogo-v3.webp", // WebP format for better performance
        width: 1024,
        height: 1536,
        alt: "Trade Hustle Resume Builder Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade Hustle Resume Builder",
    description:
      "Get hired faster with ATS-optimized trade resumes. Built for the trade. Backed by Hustle.",
    images: ["/assets/resumeBuilderLogo-v3.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        {/* ⭐ Preload LCP image for faster hero load */}
        <link
          rel="preload"
          as="image"
          href="/assets/resumeBuilderLogo-v3.webp"
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* Favicon fallback */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* ⭐ DNS prefetch for faster third-party loads */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Analytics - Deferred for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WV2HHYYKCL"
          strategy="lazyOnload"
        />
        <Script id="ga" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WV2HHYYKCL', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* Service Worker Registration - Deferred for better performance */}
        <Script id="sw-register" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                  .then(registration => console.log('SW registered:', registration.scope))
                  .catch(error => console.log('SW registration failed:', error));
              });
            }
          `}
        </Script>
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
