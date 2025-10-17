"use client";

import React from "react";
import "./ResumeVerifierSection.css";

const ResumeVerifierSection = () => {
  return (
    <section className="verifier-section">
      <div className="verifier-wrapper">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="verifier-video"
        >
          <source src="/assets/VerifierSection.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="verifier-overlay">
          <div className="scan-line"></div>
          <div className="circle-glow glow1"></div>
          <div className="circle-glow glow2"></div>

          <div className="verifier-caption">
            <p>ATS Verification in Progress</p>
            <span className="pulse-dot"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeVerifierSection;
