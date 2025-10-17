"use client";

import React from "react";
import Image from "next/image";
import "./TemplatePreviewModal.css";
import { ResumeData } from "@/data/resumeData";

interface Template {
  id: string;
  trade: string;
  title: string;
  thumbnail: string;
  features: string[];
  description: string;
  previewImage?: string;
  resumeData?: ResumeData;
}

interface TemplatePreviewModalProps {
  template: Template;
  onClose: () => void;
  onUseTemplate: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onUseTemplate,
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-content">
          {/* Left Side: Resume Preview */}
          <div className="modal-preview">
            {template.resumeData ? (
              <div className="resume-preview-card">
                <div className="resume-header">
                  <h2>{template.resumeData.fullName}</h2>
                  <p className="resume-title">{template.resumeData.title}</p>
                  <div className="resume-contact">
                    <span>📧 {template.resumeData.contact.email}</span>
                    <span>📞 {template.resumeData.contact.phone}</span>
                    <span>📍 {template.resumeData.contact.location}</span>
                  </div>
                </div>

                <div className="resume-section">
                  <h3>Professional Summary</h3>
                  <p>{template.resumeData.summary}</p>
                </div>

                <div className="resume-section">
                  <h3>Core Skills</h3>
                  <div className="skills-grid">
                    {template.resumeData.coreSkills.slice(0, 6).map((skill, idx) => (
                      <span key={idx} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="resume-section">
                  <h3>Certifications</h3>
                  <ul className="cert-list">
                    {template.resumeData.certifications.map((cert, idx) => (
                      <li key={idx}>
                        <span className="cert-icon">🏆</span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                {template.resumeData.experience.length > 0 && (
                  <div className="resume-section">
                    <h3>Recent Experience</h3>
                    <div className="experience-item">
                      <h4>{template.resumeData.experience[0].position}</h4>
                      <p className="company">{template.resumeData.experience[0].company}</p>
                      <p className="dates">{template.resumeData.experience[0].dates}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Image
                src={template.previewImage || template.thumbnail}
                alt={`${template.title} full preview`}
                width={600}
                height={800}
                className="preview-image"
              />
            )}
          </div>

          {/* Right Side: Details & Actions */}
          <div className="modal-details">
            <div className="modal-header">
              <span className="modal-trade">{template.trade}</span>
              <h2 className="modal-title">{template.title}</h2>
              <p className="modal-description">{template.description}</p>
            </div>

            <div className="modal-features">
              <h3>What's Included:</h3>
              <ul>
                {template.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {template.resumeData && (
              <div className="modal-highlights">
                <h3>Template Highlights:</h3>
                <div className="highlight-stats">
                  <div className="stat-box">
                    <span className="stat-number">{template.resumeData.coreSkills.length}</span>
                    <span className="stat-label">Skills Listed</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">{template.resumeData.certifications.length}</span>
                    <span className="stat-label">Certifications</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">{template.resumeData.experience.length}</span>
                    <span className="stat-label">Positions</span>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-use-modal" onClick={onUseTemplate}>
                Start Building
              </button>
              <button className="btn-download">
                Download Sample PDF
              </button>
            </div>

            <div className="modal-trust">
              <p className="trust-badge">
                ✅ <strong>ATS-Verified</strong> by Trade Hustle Engine
              </p>
              <p className="trust-stat">
                92% average recruiter pass rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
