"use client";

import React from "react";
import "./TemplatesFooterCTA.css";

const TemplatesFooterCTA = () => {
  return (
    <section className="templates-footer-cta">
      <div className="footer-cta-content">
        <h2 className="footer-cta-title">
          Get Hired Faster with <span className="highlight">Trade Hustle</span>
        </h2>
        <p className="footer-cta-subtitle">
          Join thousands of trade professionals landing interviews 3x faster with ATS-optimized resumes.
        </p>
        <a href="/builder" className="btn-footer-cta">
          Build My Resume Now
        </a>
        
        <div className="footer-trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text">ATS-Verified Templates</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text">Industry-Specific</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text">Instant Download</span>
          </div>
        </div>
      </div>

      <div className="footer-cta-bg">
        <div className="footer-gradient-1"></div>
        <div className="footer-gradient-2"></div>
      </div>
    </section>
  );
};

export default TemplatesFooterCTA;
