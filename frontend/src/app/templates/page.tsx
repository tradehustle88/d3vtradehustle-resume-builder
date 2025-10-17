"use client";

import React from "react";
import TopNavBar from "@/components/TopNavBar";
import TemplatesHeroSection from "@/components/templates/TemplatesHeroSection";
import TemplateGrid from "@/components/templates/TemplateGrid";
import ResumeVerifierSection from "@/components/ResumeVerifierSection";
import TemplatesFooterCTA from "@/components/templates/TemplatesFooterCTA";
import Footer from "@/components/Footer";
import { templates } from "@/data/templates";
import "./templates.css";

// SEO Metadata (moved to layout or add via next/head for client components)
export const metadata = {
  title: "Trade Resume Templates | ATS-Optimized for HVAC, Electrician & More | Trade Hustle",
  description: "Download professional trade resume templates with 92% ATS pass rate. Built for HVAC techs, electricians, plumbers, welders, carpenters, and mechanics. Free templates designed by industry experts.",
  keywords: "trade resume templates, HVAC resume, electrician resume, plumber resume, welder resume, carpenter resume, mechanic resume, ATS resume, construction resume, skilled trades resume",
  openGraph: {
    title: "Professional Trade Resume Templates | Trade Hustle",
    description: "ATS-optimized resume templates for skilled trades. 92% recruiter pass rate. Download free templates for HVAC, electrical, plumbing, welding, carpentry, and automotive careers.",
    type: "website",
    url: "https://tradehustleresumebuilder.web.app/templates",
    images: [
      {
        url: "/assets/og-templates.png",
        width: 1200,
        height: 630,
        alt: "Trade Hustle Resume Templates"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade Resume Templates | 92% ATS Pass Rate",
    description: "Professional resume templates for skilled trades. Free download for HVAC, electrician, plumber, welder, carpenter, and mechanic resumes.",
    images: ["/assets/twitter-templates.png"]
  },
  alternates: {
    canonical: "https://tradehustleresumebuilder.web.app/templates"
  }
};

export default function TemplatesPage() {
  return (
    <main className="templates-page">
      {/* Header Navigation */}
      <TopNavBar />

      {/* Hero Section */}
      <TemplatesHeroSection />

      {/* Template Gallery */}
      <section id="templates-grid" className="templates-gallery-section">
        <div className="templates-section-header">
          <h2 className="section-title">Choose Your Trade Template</h2>
          <p className="section-subtitle">
            Each template is optimized for Applicant Tracking Systems (ATS) and designed to highlight
            the skills, certifications, and experience that matter most in your trade.
          </p>
        </div>
        <TemplateGrid templates={templates} />
      </section>

      {/* ATS Verification Proof */}
      <section className="templates-trust-section">
        <div className="trust-content">
          <h2 className="trust-title">
            Verified by Trade Hustle ATS Engine
          </h2>
          <p className="trust-description">
            Our templates achieve a <strong>92% average recruiter pass rate</strong>, 
            tested against leading ATS systems used by construction firms, unions, and trade contractors.
          </p>
        </div>
        <ResumeVerifierSection />
      </section>

      {/* Footer CTA */}
      <TemplatesFooterCTA />

      {/* Site Footer */}
      <Footer />
    </main>
  );
}
