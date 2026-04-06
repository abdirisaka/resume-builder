'use client';

import { useState } from 'react';
import ClassicTemplate from '@/templates/ClassicTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import TemplatePicker, { TemplateId } from '@/components/TemplatePicker';
import ValidationPanel from '@/components/ValidationPanel';
import { ResumeData } from '@/types/resume';
import { validateResume } from '@/lib/validation';

interface Props {
  data: ResumeData;
}

type DownloadState = 'idle' | 'loading' | 'error';

export default function ResumePreview({ data }: Props) {
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');

  const handleDownloadClick = () => {
    const result = validateResume(data);
    if (!result.valid || result.warnings.length > 0) {
      setShowValidation(true);
    } else {
      triggerServerPDF();
    }
  };

  const triggerServerPDF = async () => {
    setShowValidation(false);
    setDownloadState('loading');

    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: data, template }),
      });

      if (!res.ok) {
        // API unavailable (e.g. local dev without Chromium) — fall back to print
        console.warn('PDF API unavailable, falling back to window.print()');
        setDownloadState('idle');
        setTimeout(() => window.print(), 100);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = data.personal.fullName
        ? `${data.personal.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`
        : 'resume.pdf';
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadState('idle');
    } catch {
      // Network error — fall back to print
      console.warn('PDF fetch failed, falling back to window.print()');
      setDownloadState('idle');
      setTimeout(() => window.print(), 100);
    }
  };

  const triggerPrint = () => {
    setShowValidation(false);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="resume-preview-panel">
      {/* Toolbar */}
      <div className="preview-toolbar print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Live Preview</span>
          <button
            onClick={() => setShowTemplatePicker((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            {template === 'classic' ? 'Classic' : 'Modern'}
            <svg className={`h-3 w-3 transition-transform ${showTemplatePicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleDownloadClick}
          disabled={downloadState === 'loading'}
          className="download-btn disabled:opacity-60 disabled:cursor-wait"
        >
          {downloadState === 'loading' ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* Template picker dropdown */}
      {showTemplatePicker && (
        <div className="print:hidden border-b border-slate-200 bg-white px-4 py-3">
          <TemplatePicker
            selected={template}
            onChange={(id) => {
              setTemplate(id);
              setShowTemplatePicker(false);
            }}
          />
        </div>
      )}

      {/* Resume paper */}
      <div className="preview-paper-wrapper">
        <div className="preview-paper">
          {template === 'classic'
            ? <ClassicTemplate data={data} />
            : <ModernTemplate data={data} />
          }
        </div>
      </div>

      {/* PDF hint */}
      <p className="preview-hint print:hidden">
        PDF downloads directly on Vercel. In local dev without Chromium, it falls back to browser print → Save as PDF.
      </p>

      {/* Validation modal */}
      {showValidation && (
        <ValidationPanel
          result={validateResume(data)}
          onClose={() => setShowValidation(false)}
          onDownloadAnyway={triggerServerPDF}
        />
      )}
    </div>
  );
}
