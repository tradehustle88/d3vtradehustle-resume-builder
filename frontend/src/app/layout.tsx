import type { Metadata } from "next";
// Temporarily disable Google Fonts for build compatibility
// import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/useAuth";
import Footer from "@/components/Footer";
import "./globals.css";

// Load fonts - disabled due to network restrictions in build environment
// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

// const jetbrainsMono = JetBrains_Mono({
//   variable: "--font-jetbrains-mono",
//   subsets: ["latin"],
// });

// Metadata (SEO + OG + Social)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://resume.nexxgennhustle.com'),
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
        url: "/assets/resumeBuilderLogo-v3.png", // hosted in /public
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
    images: ["/assets/resumeBuilderLogo-v3.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon fallback */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* DNS Prefetch for external resources - improves 3rd party load time */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Font Awesome for social media icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Google Fonts Optimized - display=swap prevents FOIT/FOUT */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anton&family=Merriweather:wght@400;700&family=EB+Garamond:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Preload critical fonts for better LCP - Anton is primary hero font */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WV2HHYYKCL"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WV2HHYYKCL', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className="antialiased flex flex-col min-h-screen"
      >
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
