"use client";

import React from "react";
import "./BuilderPreview.css";

interface BuilderPreviewProps {
  formData: any;
  template: any;
}

export default function BuilderPreview({ formData, template }: BuilderPreviewProps) {
  const contactInfo = formData.contactInfo || template.resumeData?.contactInfo || {};
  const summary = formData.summary || template.resumeData?.summary || '';
  const experience = formData.experience || template.resumeData?.experience || [];
  const skills = formData.skills || template.resumeData?.skills || {};
  const certifications = formData.certifications || template.resumeData?.certifications || [];

  return (
    <div className="builder-preview">
      <div className="preview-header">
        <h3 className="preview-title">Live Preview</h3>
        <span className="preview-trade">{template.trade}</span>
      </div>
      
      <div className="preview-resume">
        {/* Header */}
        <div className="resume-header">
          <h1 className="resume-name">
            {contactInfo.name || "Your Name"}
          </h1>
          <div className="resume-contact">
            {contactInfo.phone && <span>{contactInfo.phone}</span>}
            {contactInfo.email && <span>{contactInfo.email}</span>}
            {contactInfo.location && <span>{contactInfo.location}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="resume-section">
            <h2 className="section-title">Professional Summary</h2>
            <p className="summary-text">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="resume-section">
            <h2 className="section-title">Work Experience</h2>
            {experience.map((exp: any, index: number) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h3 className="job-title">{exp.title || "Job Title"}</h3>
                  <span className="dates">{exp.dates || "Dates"}</span>
                </div>
                <div className="company">{exp.company || "Company Name"}</div>
                {exp.responsibilities && (
                  <ul className="responsibilities">
                    {exp.responsibilities.map((resp: string, i: number) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.technical && skills.technical.length > 0 && (
          <div className="resume-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {skills.technical.map((skill: string, index: number) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="resume-section">
            <h2 className="section-title">Certifications</h2>
            <ul className="certifications-list">
              {certifications.map((cert: any, index: number) => (
                <li key={index}>
                  <strong>{cert.name || "Certification"}</strong>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.date && <span> ({cert.date})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
