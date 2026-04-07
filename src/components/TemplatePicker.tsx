'use client';

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'executive' | 'creative';

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

const TEMPLATES: { id: TemplateId; label: string; description: string; color: string }[] = [
  { id: 'classic',    label: 'Classic',    description: 'Traditional serif. Finance, law, academia.',    color: '#1a1a1a' },
  { id: 'modern',     label: 'Modern',     description: 'Clean sidebar. Tech, startups, design.',         color: '#1e293b' },
  { id: 'minimal',    label: 'Minimal',    description: 'Ultra clean. Lets your content speak.',          color: '#374151' },
  { id: 'executive',  label: 'Executive',  description: 'Premium gold accents. Senior & C-suite roles.',  color: '#92400e' },
  { id: 'creative',   label: 'Creative',   description: 'Bold sidebar colour. Creative industries.',      color: '#4338ca' },
];

export default function TemplatePicker({ selected, onChange }: Props) {
  return (
    <div className="template-picker-grid">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`template-option-card ${selected === t.id ? 'selected' : ''}`}
        >
          {/* Mini preview */}
          <div className="template-mini-preview" style={{ borderTopColor: t.color }}>
            <div className="tmp-line bold" style={{ background: t.color }} />
            <div className="tmp-line" />
            <div className="tmp-line short" />
            <div className="tmp-spacer" />
            <div className="tmp-line" />
            <div className="tmp-line short" />
          </div>
          <div className="template-option-label">{t.label}</div>
          <div className="template-option-desc">{t.description}</div>
          {selected === t.id && (
            <div className="template-selected-badge">✓</div>
          )}
        </button>
      ))}
    </div>
  );
}
