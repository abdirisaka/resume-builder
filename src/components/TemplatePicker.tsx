'use client';

export type TemplateId = 'classic' | 'modern';

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

const TEMPLATES: { id: TemplateId; label: string; description: string }[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Traditional serif layout. Best for finance, law, academia.',
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Clean sidebar layout. Best for tech, design, startups.',
  },
];

export default function TemplatePicker({ selected, onChange }: Props) {
  return (
    <div className="template-picker">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`template-option ${selected === t.id ? 'selected' : ''}`}
        >
          <div className="template-option-inner">
            {/* Tiny visual thumbnail */}
            <div className={`template-thumb ${t.id}`} aria-hidden>
              {t.id === 'classic' ? (
                <div className="thumb-classic">
                  <div className="thumb-name" />
                  <div className="thumb-contact" />
                  <div className="thumb-line" />
                  <div className="thumb-row" /><div className="thumb-row short" />
                  <div className="thumb-line" />
                  <div className="thumb-row" /><div className="thumb-row short" />
                </div>
              ) : (
                <div className="thumb-modern">
                  <div className="thumb-modern-header" />
                  <div className="thumb-modern-body">
                    <div className="thumb-modern-main">
                      <div className="thumb-row" /><div className="thumb-row short" />
                      <div className="thumb-spacer" />
                      <div className="thumb-row" /><div className="thumb-row short" />
                    </div>
                    <div className="thumb-modern-aside">
                      <div className="thumb-row short" />
                      <div className="thumb-tag" /><div className="thumb-tag" /><div className="thumb-tag" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="template-option-label">{t.label}</div>
              <div className="template-option-desc">{t.description}</div>
            </div>
          </div>
          {selected === t.id && (
            <svg className="template-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
