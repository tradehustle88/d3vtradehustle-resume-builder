// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Trade Hustle",
  description: "Unlock the hustle. Built for the Trade. Backed by Hustle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-[#141414] to-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
