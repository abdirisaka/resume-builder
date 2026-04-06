'use client';

import { useRef, useState } from 'react';
import { ResumeData } from '@/types/resume';
import PersonalInfoForm from './sections/PersonalInfoForm';
import ExperienceForm from './sections/ExperienceForm';
import EducationForm from './sections/EducationForm';
import SkillsForm from './sections/SkillsForm';
import { exportResumeJSON, importResumeJSON } from '@/lib/exportImport';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onLoadSample: () => void;
  onClear: () => void;
}

interface Section {
  id: string;
  title: string;
  icon: string;
}

const SECTIONS: Section[] = [
  { id: 'personal', title: 'Personal Info', icon: '👤' },
  { id: 'summary', title: 'Professional Summary', icon: '📝' },
  { id: 'experience', title: 'Work Experience', icon: '💼' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'skills', title: 'Skills', icon: '⚡' },
];

export default function ResumeForm({ data, onChange, onLoadSample, onClear }: Props) {
  const [openSection, setOpenSection] = useState<string>('personal');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? '' : id));
  };

  const handleExport = () => {
    exportResumeJSON(data);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const imported = await importResumeJSON(file);
      onChange(imported);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    }
    // Reset the input so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <div className="resume-form">
      {/* Top actions */}
      <div className="form-top-actions">
        <button onClick={onLoadSample} className="action-btn-secondary text-xs">
          Load Sample
        </button>
        <button onClick={handleImportClick} className="action-btn-secondary text-xs" title="Import a previously exported .json file">
          Import JSON
        </button>
        <button onClick={handleExport} className="action-btn-secondary text-xs" title="Save resume as .json — reload it any time">
          Export JSON
        </button>
        <button onClick={onClear} className="action-btn-danger text-xs">
          Clear
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {importError && (
        <div className="import-error">
          <span>⚠️ {importError}</span>
          <button onClick={() => setImportError(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-2">
        {SECTIONS.map((section) => (
          <div key={section.id} className="form-section-wrapper">
            <button
              className={`form-section-toggle ${openSection === section.id ? 'open' : ''}`}
              onClick={() => toggleSection(section.id)}
            >
              <span className="flex items-center gap-2">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${openSection === section.id ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSection === section.id && (
              <div className="form-section-content">
                {section.id === 'personal' && (
                  <PersonalInfoForm
                    data={data.personal}
                    onChange={(personal) => onChange({ ...data, personal })}
                  />
                )}
                {section.id === 'summary' && (
                  <div>
                    <label className="form-label">Summary</label>
                    <textarea
                      className="form-input min-h-[120px] resize-y"
                      placeholder="Results-driven professional with X years of experience in..."
                      value={data.summary}
                      onChange={(e) => onChange({ ...data, summary: e.target.value })}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Keep this to 2–4 sentences. Tailor it for each role you apply to.
                    </p>
                  </div>
                )}
                {section.id === 'experience' && (
                  <ExperienceForm
                    data={data.experience}
                    onChange={(experience) => onChange({ ...data, experience })}
                  />
                )}
                {section.id === 'education' && (
                  <EducationForm
                    data={data.education}
                    onChange={(education) => onChange({ ...data, education })}
                  />
                )}
                {section.id === 'skills' && (
                  <SkillsForm
                    data={data.skills}
                    onChange={(skills) => onChange({ ...data, skills })}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
