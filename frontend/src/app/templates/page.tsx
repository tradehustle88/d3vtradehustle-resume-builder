"use client";

import React, { useEffect } from "react";
import TopNavBar from "@/components/TopNavBar";
import TemplatesHeroSection from "@/components/templates/TemplatesHeroSection";
import TemplateGrid from "@/components/templates/TemplateGrid";
import ResumeVerifierSection from "@/components/ResumeVerifierSection";
import TemplatesFooterCTA from "@/components/templates/TemplatesFooterCTA";
import Footer from "@/components/Footer";
import { templates } from "@/data/templates";
import "./templates.css";

export default function TemplatesPage() {
  // Set page title and meta tags for client component
  useEffect(() => {
    document.title = "Trade Resume Templates | ATS-Optimized for HVAC, Electrician & More | Trade Hustle";
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMetaTag('description', 'Download professional trade resume templates with 92% ATS pass rate. Built for HVAC techs, electricians, plumbers, welders, carpenters, and mechanics.');
    updateMetaTag('keywords', 'trade resume templates, HVAC resume, electrician resume, plumber resume, welder resume, carpenter resume, mechanic resume, ATS resume, construction resume, skilled trades resume');
    updateMetaTag('og:title', 'Professional Trade Resume Templates | Trade Hustle', true);
    updateMetaTag('og:description', 'ATS-optimized resume templates for skilled trades. 92% recruiter pass rate.', true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', 'https://tradehustleresumebuilder.web.app/templates', true);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'Trade Resume Templates | 92% ATS Pass Rate');
  }, []);

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

      {/* Footer */}
      <Footer />
    </main>
  );
}
