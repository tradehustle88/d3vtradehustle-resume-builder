"use client";

import React from "react";

interface CertificationsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  trade: string;
}

export default function CertificationsForm({ data, onUpdate, trade }: CertificationsFormProps) {
  const certifications = data.certifications || [];
  const education = data.education || [];

  const addCertification = () => {
    onUpdate({
      certifications: [
        ...certifications,
        { name: '', issuer: '', date: '', number: '' }
      ]
    });
  };

  const removeCertification = (index: number) => {
    const updated = certifications.filter((_: any, i: number) => i !== index);
    onUpdate({ certifications: updated });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ certifications: updated });
  };

  const addEducation = () => {
    onUpdate({
      education: [
        ...education,
        { degree: '', school: '', year: '' }
      ]
    });
  };

  const removeEducation = (index: number) => {
    const updated = education.filter((_: any, i: number) => i !== index);
    onUpdate({ education: updated });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ education: updated });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Certifications & Licenses</h3>
      <p className="form-hint" style={{ marginBottom: '1.5rem' }}>
        List all relevant {trade} certifications, licenses, and safety training.
      </p>

      {certifications.map((cert: any, index: number) => (
        <div key={index} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">Certification {index + 1}</span>
            {certifications.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeCertification(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Certification Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="EPA 608 Certification, Journeyman License, etc."
              value={cert.name || ''}
              onChange={(e) => updateCertification(index, 'name', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Issuing Organization</label>
              <input
                type="text"
                className="form-input"
                placeholder="EPA, State Board, NCCER, etc."
                value={cert.issuer || ''}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue/Expiry Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="2023 - 2026"
                value={cert.date || ''}
                onChange={(e) => updateCertification(index, 'date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">License/Certification Number (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="License #123456"
              value={cert.number || ''}
              onChange={(e) => updateCertification(index, 'number', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={addCertification}
        style={{ width: '100%', marginBottom: '2rem' }}
      >
        + Add Certification
      </button>

      <h3 className="form-section-title" style={{ marginTop: '2rem' }}>Education</h3>
      <p className="form-hint" style={{ marginBottom: '1.5rem' }}>
        Include trade schools, apprenticeships, or formal education.
      </p>

      {education.map((edu: any, index: number) => (
        <div key={index} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">Education {index + 1}</span>
            {education.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeEducation(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Degree/Program</label>
            <input
              type="text"
              className="form-input"
              placeholder="Apprenticeship, Associate's Degree, etc."
              value={edu.degree || ''}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">School/Organization</label>
              <input
                type="text"
                className="form-input"
                placeholder="Technical College, Union, etc."
                value={edu.school || ''}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="2020"
                value={edu.year || ''}
                onChange={(e) => updateEducation(index, 'year', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={addEducation}
        style={{ width: '100%' }}
      >
        + Add Education
      </button>
    </div>
  );
}
