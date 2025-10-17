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
