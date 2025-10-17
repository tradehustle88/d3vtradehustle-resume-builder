"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";
import BuilderSteps from "@/components/builder/BuilderSteps";
import BuilderForm from "@/components/builder/BuilderForm";
import BuilderPreview from "@/components/builder/BuilderPreview";
import { templates } from "@/data/templates";
import { trackEvent } from "@/lib/analytics";
import "./builder.css";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Set page title
    document.title = "Resume Builder | Trade Hustle";

    // Load template if specified
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        // Pre-populate with template data
        setFormData(template.resumeData || {});
        
        // Track builder start
        trackEvent('builder_started', {
          trade: template.trade,
          template_id: template.id,
          event_category: 'Resume Builder',
        });
      } else {
        // Invalid template ID, redirect to templates
        router.push('/templates');
      }
    }
  }, [templateId, router]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    trackEvent('builder_step_changed', {
      step: step,
      event_category: 'Resume Builder',
      event_label: `Step ${step}`,
    });
  };

  const handleFormUpdate = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  const handleDownload = () => {
    trackEvent('resume_downloaded', {
      trade: selectedTemplate?.trade || 'unknown',
      template_id: selectedTemplate?.id || 0,
      event_category: 'Resume Builder',
      event_label: 'Download Click',
    });
    // TODO: Implement PDF generation
    alert('PDF download functionality coming soon!');
  };

  if (!templateId) {
    return (
      <main className="builder-page">
        <TopNavBar />
        <div className="builder-container">
          <div className="builder-error">
            <h1>No Template Selected</h1>
            <p>Please select a template from the templates page to start building your resume.</p>
            <button 
              className="btn-hustle"
              onClick={() => router.push('/templates')}
            >
              Browse Templates
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!selectedTemplate) {
    return (
      <main className="builder-page">
        <TopNavBar />
        <div className="builder-container">
          <div className="builder-loading">
            <p>Loading template...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="builder-page">
      <TopNavBar />
      
      <div className="builder-container">
        {/* Header */}
        <div className="builder-header">
          <h1 className="builder-title">
            Build Your {selectedTemplate.trade} Resume
          </h1>
          <p className="builder-subtitle">
            Fill in your details below. Your resume updates in real-time.
          </p>
        </div>

        {/* Progress Steps */}
        <BuilderSteps 
          currentStep={currentStep}
          onStepClick={handleStepChange}
        />

        {/* Main Builder Area */}
        <div className="builder-workspace">
          {/* Form Section */}
          <div className="builder-form-section">
            <BuilderForm
              currentStep={currentStep}
              formData={formData}
              onUpdate={handleFormUpdate}
              templateTrade={selectedTemplate.trade}
            />
            
            {/* Navigation Buttons */}
            <div className="builder-navigation">
              {currentStep > 1 && (
                <button
                  className="btn-secondary"
                  onClick={() => handleStepChange(currentStep - 1)}
                >
                  ← Previous
                </button>
              )}
              {currentStep < 5 && (
                <button
                  className="btn-hustle"
                  onClick={() => handleStepChange(currentStep + 1)}
                >
                  Next →
                </button>
              )}
              {currentStep === 5 && (
                <button
                  className="btn-hustle"
                  onClick={handleDownload}
                >
                  Download Resume
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="builder-preview-section">
            <BuilderPreview
              formData={formData}
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
