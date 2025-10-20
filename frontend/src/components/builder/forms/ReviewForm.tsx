"use client";

import React from "react";

interface ReviewFormProps {
  data: any;
}

export default function ReviewForm({ data }: ReviewFormProps) {
  const contactInfo = data.contactInfo || {};
  const experience = data.experience || [];
  const skills = data.skills || {};
  const certifications = data.certifications || [];
  const education = data.education || [];

  const isComplete = (section: any) => {
    if (Array.isArray(section)) return section.length > 0;
    if (typeof section === 'object') return Object.keys(section).length > 0;
    return !!section;
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Review Your Resume</h3>
      <p className="form-hint" style={{ marginBottom: '1.5rem' }}>
        Review all sections before downloading. You can go back to any step to make changes.
      </p>

      <div className="review-checklist">
        <div className={`review-item ${isComplete(contactInfo) ? 'complete' : 'incomplete'}`}>
          <span className="review-icon">{isComplete(contactInfo) ? '✓' : '○'}</span>
          <div className="review-content">
            <h4>Contact Information</h4>
            {contactInfo.name && <p><strong>Name:</strong> {contactInfo.name}</p>}
            {contactInfo.phone && <p><strong>Phone:</strong> {contactInfo.phone}</p>}
            {contactInfo.email && <p><strong>Email:</strong> {contactInfo.email}</p>}
            {contactInfo.location && <p><strong>Location:</strong> {contactInfo.location}</p>}
            {!isComplete(contactInfo) && <p className="warning">Missing contact information</p>}
          </div>
        </div>

        <div className={`review-item ${isComplete(experience) ? 'complete' : 'incomplete'}`}>
          <span className="review-icon">{isComplete(experience) ? '✓' : '○'}</span>
          <div className="review-content">
            <h4>Work Experience</h4>
            {experience.length > 0 ? (
              <p>{experience.length} position(s) added</p>
            ) : (
              <p className="warning">No work experience added</p>
            )}
          </div>
        </div>

        <div className={`review-item ${isComplete(skills) ? 'complete' : 'incomplete'}`}>
          <span className="review-icon">{isComplete(skills) ? '✓' : '○'}</span>
          <div className="review-content">
            <h4>Skills</h4>
            {skills.technical?.length > 0 ? (
              <>
                <p><strong>Technical:</strong> {skills.technical.length} skills</p>
                {skills.tools?.length > 0 && <p><strong>Tools:</strong> {skills.tools.length} items</p>}
                {skills.soft?.length > 0 && <p><strong>Soft Skills:</strong> {skills.soft.length} items</p>}
              </>
            ) : (
              <p className="warning">No skills added</p>
            )}
          </div>
        </div>

        <div className={`review-item ${isComplete(certifications) ? 'complete' : 'incomplete'}`}>
          <span className="review-icon">{isComplete(certifications) ? '✓' : '○'}</span>
          <div className="review-content">
            <h4>Certifications</h4>
            {certifications.length > 0 ? (
              <p>{certifications.length} certification(s) added</p>
            ) : (
              <p className="warning">No certifications added (recommended)</p>
            )}
          </div>
        </div>

        <div className={`review-item ${isComplete(education) ? 'complete' : 'optional'}`}>
          <span className="review-icon">{isComplete(education) ? '✓' : '○'}</span>
          <div className="review-content">
            <h4>Education</h4>
            {education.length > 0 ? (
              <p>{education.length} education entry/entries added</p>
            ) : (
              <p className="optional-text">Optional - Not required for all trades</p>
            )}
          </div>
        </div>
      </div>

      <div className="review-summary">
        <h4>Next Steps</h4>
        <ol>
          <li>Review the live preview on the right</li>
          <li>Make any final adjustments by going back to previous steps</li>
          <li>Click "Download Resume" to get your ATS-optimized PDF</li>
          <li>Use the PDF to apply for jobs or share with recruiters</li>
        </ol>
      </div>

      <style jsx>{`
        .review-checklist {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .review-item {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 215, 0, 0.1);
          border-radius: 8px;
        }

        .review-item.complete {
          border-color: rgba(0, 255, 0, 0.3);
          background: rgba(0, 255, 0, 0.05);
        }

        .review-item.incomplete {
          border-color: rgba(255, 165, 0, 0.3);
          background: rgba(255, 165, 0, 0.05);
        }

        .review-icon {
          font-size: 1.5rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .review-item.complete .review-icon {
          color: #00ff00;
        }

        .review-item.incomplete .review-icon {
          color: #ffa500;
        }

        .review-content {
          flex: 1;
        }

        .review-content h4 {
          color: #ffd700;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .review-content p {
          color: #b8c5d6;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        .warning {
          color: #ffa500 !important;
          font-weight: 600;
        }

        .optional-text {
          color: #888 !important;
          font-style: italic;
        }

        .review-summary {
          background: rgba(22, 115, 255, 0.1);
          border: 1px solid rgba(22, 115, 255, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .review-summary h4 {
          color: #1673ff;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .review-summary ol {
          color: #b8c5d6;
          padding-left: 1.5rem;
        }

        .review-summary li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
