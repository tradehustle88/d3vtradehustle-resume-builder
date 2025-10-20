"use client";

import React, { useState } from "react";
import TemplateCard from "./TemplateCard";
import TemplatePreviewModal from "./TemplatePreviewModal";
import "./TemplateGrid.css";
import { ResumeData } from "@/data/resumeData";
import { trackTemplateView, trackTemplateModalOpen, trackTemplateUseClick } from "@/lib/analytics";

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

interface TemplateGridProps {
  templates: Template[];
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleViewTemplate = (template: Template) => {
    trackTemplateModalOpen(template.id, template.trade);
    setSelectedTemplate(template);
  };

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Check if user is authenticated (you can add useAuth hook here)
      const isAuthenticated = false; // Replace with actual auth check
      trackTemplateUseClick(template.id, template.trade, isAuthenticated);
    }
    
    // Navigate to builder with template ID
    window.location.href = `/builder?template=${templateId}`;
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
  };

  return (
    <>
      <div className="template-grid">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            trade={template.trade}
            title={template.title}
            thumbnail={template.thumbnail}
            features={template.features}
            resumeData={template.resumeData}
            onViewTemplate={() => handleViewTemplate(template)}
            onUseTemplate={() => handleUseTemplate(template.id)}
          />
        ))}
      </div>

      {selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          onClose={handleCloseModal}
          onUseTemplate={() => handleUseTemplate(selectedTemplate.id)}
        />
      )}
    </>
  );
};

export default TemplateGrid;
