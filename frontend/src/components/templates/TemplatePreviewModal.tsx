"use client";

import React from "react";
import Image from "next/image";
import "./TemplatePreviewModal.css";

interface Template {
  id: string;
  trade: string;
  title: string;
  thumbnail: string;
  features: string[];
  description: string;
  previewImage?: string;
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
          {/* Left Side: Preview */}
          <div className="modal-preview">
            <Image
              src={template.previewImage || template.thumbnail}
              alt={`${template.title} full preview`}
              width={600}
              height={800}
              className="preview-image"
            />
          </div>

          {/* Right Side: Details */}
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
