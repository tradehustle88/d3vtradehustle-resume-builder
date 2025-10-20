"use client";

import React from "react";
import ContactInfoForm from "./forms/ContactInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import SkillsForm from "./forms/SkillsForm";
import CertificationsForm from "./forms/CertificationsForm";
import ReviewForm from "./forms/ReviewForm";
import "./BuilderForm.css";

interface BuilderFormProps {
  currentStep: number;
  formData: any;
  onUpdate: (data: any) => void;
  templateTrade: string;
}

export default function BuilderForm({ currentStep, formData, onUpdate, templateTrade }: BuilderFormProps) {
  return (
    <div className="builder-form">
      {currentStep === 1 && (
        <ContactInfoForm data={formData} onUpdate={onUpdate} />
      )}
      {currentStep === 2 && (
        <ExperienceForm data={formData} onUpdate={onUpdate} trade={templateTrade} />
      )}
      {currentStep === 3 && (
        <SkillsForm data={formData} onUpdate={onUpdate} trade={templateTrade} />
      )}
      {currentStep === 4 && (
        <CertificationsForm data={formData} onUpdate={onUpdate} trade={templateTrade} />
      )}
      {currentStep === 5 && (
        <ReviewForm data={formData} />
      )}
    </div>
  );
}
