"use client";

import React from "react";
import "./BuilderSteps.css";

interface BuilderStepsProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { number: 1, title: "Contact Info", icon: "👤" },
  { number: 2, title: "Experience", icon: "💼" },
  { number: 3, title: "Skills", icon: "🔧" },
  { number: 4, title: "Certifications", icon: "📜" },
  { number: 5, title: "Review", icon: "✓" },
];

export default function BuilderSteps({ currentStep, onStepClick }: BuilderStepsProps) {
  return (
    <div className="builder-steps">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            onClick={() => onStepClick(step.number)}
          >
            <div className="step-icon">{step.icon}</div>
            <div className="step-content">
              <div className="step-number">Step {step.number}</div>
              <div className="step-title">{step.title}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
