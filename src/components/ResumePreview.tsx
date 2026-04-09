'use client';

import { useState } from 'react';
import ClassicTemplate from '@/templates/ClassicTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import TemplatePicker, { TemplateId } from '@/components/TemplatePicker';
import ValidationPanel from '@/components/ValidationPanel';
import { ResumeData } from '@/types/resume';
import { validateResume } from '@/lib/validation';

interface Props { data: ResumeData; }

export default function ResumePreview({ data }: Props) {
    const [template, setTemplate] = useState<TemplateId>('classic');
    const [showTemplatePicker, setShowTemplatePicker] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

  const triggerPrint = () => {
        setShowValidation(false);
        setTimeout(() => window.print(), 150);
  };

  const handleDownload = () => {
        const result = validateResume(data);
        if (!result.valid || result.warnings.length > 0) {
                setShowValidation(true);
        } else {
                triggerPrint();
        }
  };

  const TemplateComponent = {
        classic: ClassicTemplate,
        modern: ModernTemplate,
        minimal: MinimalTemplate,
        executive: ExecutiveTemplate,
        creative: CreativeTemplate,
  }[template];

  return (
        <div className="resume-preview-panel">
              <div className="preview-toolbar print:hidden">
                      <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-600">Preview</span>span>
                                <button
                                              onClick={() => setShowTemplatePicker((v) => !v)}
                                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                  {template.charAt(0).toUpperCase() + template.slice(1)}
                                            <svg className={`h-3 w-3 transition-transform ${showTemplatePicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>svg>
                                </button>button>
                      </div>div>
                      <button onClick={handleDownload} className="download-btn">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>svg>
                                Download PDF
                      </button>button>
              </div>div>
        
          {showTemplatePicker && (
                  <div className="print:hidden border-b border-slate-200 bg-white px-4 py-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Choose a template</p>p>
                            <TemplatePicker selected={template} onChange={(id) => { setTemplate(id); setShowTemplatePicker(false); }} />
                  </div>div>
              )}
        
              <div className="preview-paper-wrapper">
                      <div className="preview-paper" id="resume-print-area">
                                <TemplateComponent data={data} />
                      </div>div>
              </div>div>
        
              <div className="preview-hint print:hidden">
                      💡 When saving: set <strong>Destination</strong>strong> to <strong>Save as PDF</strong>strong>, <strong>Margins</strong>strong> to <strong>None</strong>strong>.
              </div>div>
        
          {showValidation && (
                  <ValidationPanel
                              result={validateResume(data)}
                              onClose={() => setShowValidation(false)}
                              onDownloadAnyway={triggerPrint}
                            />
                )}
        </div>div>
      );
}</div>
