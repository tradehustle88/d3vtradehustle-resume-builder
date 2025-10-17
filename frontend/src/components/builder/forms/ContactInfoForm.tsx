"use client";

import React from "react";

interface ContactInfoFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function ContactInfoForm({ data, onUpdate }: ContactInfoFormProps) {
  const contactInfo = data.contactInfo || {};

  const handleChange = (field: string, value: string) => {
    onUpdate({
      contactInfo: {
        ...contactInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Contact Information</h3>
      
      <div className="form-group">
        <label className="form-label">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="John Smith"
          value={contactInfo.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            className="form-input"
            placeholder="(555) 123-4567"
            value={contactInfo.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="john.smith@email.com"
            value={contactInfo.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Location <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Dallas, TX"
          value={contactInfo.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
        <p className="form-hint">City and State are recommended for local job searches</p>
      </div>

      <div className="form-group">
        <label className="form-label">
          LinkedIn Profile (Optional)
        </label>
        <input
          type="url"
          className="form-input"
          placeholder="https://linkedin.com/in/yourprofile"
          value={contactInfo.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
        />
      </div>
    </div>
  );
}
