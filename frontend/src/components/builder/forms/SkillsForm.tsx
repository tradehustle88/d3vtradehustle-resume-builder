"use client";

import React from "react";

interface SkillsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  trade: string;
}

export default function SkillsForm({ data, onUpdate, trade }: SkillsFormProps) {
  const skills = data.skills || { technical: [], tools: [], soft: [] };

  const handleSkillsChange = (category: string, value: string) => {
    const skillsArray = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    onUpdate({
      skills: {
        ...skills,
        [category]: skillsArray
      }
    });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Skills & Expertise</h3>
      <p className="form-hint" style={{ marginBottom: '1.5rem' }}>
        Enter skills separated by commas. Focus on {trade}-specific technical skills, tools, and equipment.
      </p>

      <div className="form-group">
        <label className="form-label">
          Technical Skills <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder="HVAC System Installation, Ductwork Fabrication, Refrigerant Handling, System Diagnostics"
          value={skills.technical?.join(', ') || ''}
          onChange={(e) => handleSkillsChange('technical', e.target.value)}
        />
        <p className="form-hint">
          Core technical abilities relevant to {trade} work
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">
          Tools & Equipment
        </label>
        <textarea
          className="form-textarea"
          placeholder="Multimeter, Pipe Threader, Welding Equipment, Power Tools, Diagnostic Software"
          value={skills.tools?.join(', ') || ''}
          onChange={(e) => handleSkillsChange('tools', e.target.value)}
        />
        <p className="form-hint">
          Specific tools and equipment you're proficient with
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">
          Soft Skills & Additional Competencies
        </label>
        <textarea
          className="form-textarea"
          placeholder="Team Leadership, Client Communication, Problem Solving, Blueprint Reading, Safety Compliance"
          value={skills.soft?.join(', ') || ''}
          onChange={(e) => handleSkillsChange('soft', e.target.value)}
        />
        <p className="form-hint">
          Soft skills, leadership abilities, and other relevant competencies
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">
          Professional Summary (Optional)
        </label>
        <textarea
          className="form-textarea"
          placeholder={`Experienced ${trade} professional with X years in residential and commercial projects...`}
          value={data.summary || ''}
          onChange={(e) => onUpdate({ summary: e.target.value })}
        />
        <p className="form-hint">
          2-3 sentences highlighting your experience and strengths
        </p>
      </div>
    </div>
  );
}
