"use client";

import React from "react";
import Image from "next/image";
import "./TemplateCard.css";
import { ResumeData } from "@/data/resumeData";

interface TemplateCardProps {
  id: string;
  trade: string;
  title: string;
  thumbnail: string;
  features: string[];
  resumeData?: ResumeData;
  onViewTemplate: () => void;
  onUseTemplate: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  trade,
  title,
  thumbnail,
  features,
  resumeData,
  onViewTemplate,
  onUseTemplate,
}) => {
  return (
    <div className="template-card">
      <div className="template-thumbnail">
        <Image
          src={thumbnail}
          alt={`${title} template preview`}
          width={400}
          height={500}
          className="thumbnail-image"
        />
        <div className="thumbnail-overlay">
          <button className="btn-view" onClick={onViewTemplate}>
            View Template
          </button>
          <button className="btn-use" onClick={onUseTemplate}>
            Use This Template
          </button>
        </div>
      </div>

      <div className="template-details">
        <h3 className="template-title">{title}</h3>
        <p className="template-trade">{trade}</p>

        {/* Show resume summary if available */}
        {resumeData && (
          <p className="template-summary">
            {resumeData.summary.slice(0, 120)}...
          </p>
        )}

        <ul className="template-features">
          {features.map((feature, index) => (
            <li key={index}>
              <span className="feature-icon">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TemplateCard;
