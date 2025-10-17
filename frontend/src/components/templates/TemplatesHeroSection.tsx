"use client";

import React from "react";
import "./TemplatesHeroSection.css";

const TemplatesHeroSection = () => {
  const scrollToTemplates = () => {
    const templatesSection = document.getElementById("templates-grid");
    templatesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="templates-hero">
      <div className="templates-hero-content">
        <h1 className="templates-hero-title">
          Built for the Trade. <br />
          <span className="highlight">Backed by Results.</span>
        </h1>
        
        <p className="templates-hero-subtitle">
          Select a template crafted for your industry — every one ATS-ready and recruiter-approved.
        </p>

        <div className="templates-hero-actions">
          <button className="btn-primary-hero" onClick={scrollToTemplates}>
            Browse Templates
          </button>
          <a href="/builder" className="btn-secondary-hero">
            Upload My Resume
          </a>
        </div>

        <div className="templates-hero-stats">
          <div className="stat-item">
            <span className="stat-number">42+</span>
            <span className="stat-label">Trade Templates</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">92%</span>
            <span className="stat-label">ATS Pass Rate</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">3x</span>
            <span className="stat-label">Faster Callbacks</span>
          </div>
        </div>
      </div>

      <div className="templates-hero-bg">
        <div className="hero-gradient-1"></div>
        <div className="hero-gradient-2"></div>
        <div className="hero-grid"></div>
      </div>
    </section>
  );
};

export default TemplatesHeroSection;
