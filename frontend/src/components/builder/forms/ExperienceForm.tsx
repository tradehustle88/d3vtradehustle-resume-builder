"use client";

import React, { useState } from "react";
import SortableList from "../../dnd/SortableList";
import SortableItem from "../../dnd/SortableItem";
import "../../dnd/dnd.css";

interface ExperienceFormProps {
  data: any;
  onUpdate: (data: any) => void;
  trade: string;
}

export default function ExperienceForm({ data, onUpdate, trade }: ExperienceFormProps) {
  // Add unique IDs to experience items for drag-and-drop
  const experience = (data.experience || []).map((exp: any, idx: number) => ({
    ...exp,
    id: exp.id || `exp-${idx}-${Date.now()}`,
  }));

  const addExperience = () => {
    const newExp = {
      id: `exp-${experience.length}-${Date.now()}`,
      title: '',
      company: '',
      dates: '',
      location: '',
      responsibilities: ['']
    };
    onUpdate({ experience: [...experience, newExp] });
  };

  const removeExperience = (index: number) => {
    const updated = experience.filter((_: any, i: number) => i !== index);
    onUpdate({ experience: updated });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ experience: updated });
  };

  const handleReorder = (reordered: any[]) => {
    onUpdate({ experience: reordered });
  };

  const addResponsibility = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].responsibilities.push('');
    onUpdate({ experience: updated });
  };

  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const updated = [...experience];
    updated[expIndex].responsibilities[respIndex] = value;
    onUpdate({ experience: updated });
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const updated = [...experience];
    updated[expIndex].responsibilities = updated[expIndex].responsibilities.filter(
      (_: string, i: number) => i !== respIndex
    );
    onUpdate({ experience: updated });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Work Experience</h3>
      <p className="form-hint" style={{ marginBottom: '1.5rem' }}>
        List your most recent jobs first. Drag to reorder. Focus on {trade}-specific responsibilities and achievements.
      </p>

      <SortableList
        items={experience}
        onReorder={handleReorder}
        getId={(item) => item.id}
      >
        {(exp: any, expIndex: number) => (
          <SortableItem key={exp.id} id={exp.id}>
            <div className="list-item">
              <div className="list-item-header">
                <span className="list-item-title">Position {expIndex + 1}</span>
                {experience.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeExperience(expIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

          <div className="form-group">
            <label className="form-label">Job Title <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder={`Senior ${trade} Technician`}
              value={exp.title || ''}
              onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="ABC Construction Co."
                value={exp.company || ''}
                onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dates <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Jan 2020 - Present"
                value={exp.dates || ''}
                onChange={(e) => updateExperience(expIndex, 'dates', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="Dallas, TX"
              value={exp.location || ''}
              onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Responsibilities & Achievements</label>
            {exp.responsibilities?.map((resp: string, respIndex: number) => (
              <div key={respIndex} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Installed and maintained HVAC systems..."
                  value={resp}
                  onChange={(e) => updateResponsibility(expIndex, respIndex, e.target.value)}
                />
                {exp.responsibilities.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeResponsibility(expIndex, respIndex)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => addResponsibility(expIndex)}
              style={{ marginTop: '0.5rem' }}
            >
              + Add Responsibility
            </button>
          </div>
            </div>
          </SortableItem>
        )}
      </SortableList>

      <button
        type="button"
        className="btn-add"
        onClick={addExperience}
        style={{ width: '100%' }}
      >
        + Add Another Position
      </button>
    </div>
  );
}
