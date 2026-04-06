'use client';

import { EducationEntry } from '@/types/resume';
import { nanoid } from 'nanoid';

interface Props {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
}

function emptyEntry(): EducationEntry {
  return {
    id: nanoid(),
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
  };
}

export default function EducationForm({ data, onChange }: Props) {
  const add = () => onChange([...data, emptyEntry()]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));

  const update = (id: string, field: keyof EducationEntry, value: unknown) => {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-6">
      {data.map((entry, index) => (
        <div key={entry.id} className="entry-card">
          <div className="entry-card-header">
            <span className="entry-card-title">
              {entry.school || `Education ${index + 1}`}
            </span>
            <button onClick={() => remove(entry.id)} className="icon-btn icon-btn-danger" title="Remove">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label">School / University *</label>
              <input className="form-input" placeholder="University of Birmingham" value={entry.school}
                onChange={(e) => update(entry.id, 'school', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Degree</label>
              <input className="form-input" placeholder="BSc / MSc / PhD" value={entry.degree}
                onChange={(e) => update(entry.id, 'degree', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Field of Study</label>
              <input className="form-input" placeholder="Computer Science" value={entry.field}
                onChange={(e) => update(entry.id, 'field', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <input className="form-input" type="month" value={entry.startDate}
                onChange={(e) => update(entry.id, 'startDate', e.target.value)} />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input className="form-input" type="month" value={entry.endDate}
                disabled={entry.current}
                onChange={(e) => update(entry.id, 'endDate', e.target.value)} />
              <label className="flex items-center gap-2 mt-2 text-sm text-slate-500 cursor-pointer">
                <input type="checkbox" checked={entry.current}
                  onChange={(e) => update(entry.id, 'current', e.target.checked)} />
                Currently studying
              </label>
            </div>
            <div>
              <label className="form-label">Grade / Classification</label>
              <input className="form-input" placeholder="First Class / Distinction / 3.8 GPA" value={entry.gpa ?? ''}
                onChange={(e) => update(entry.id, 'gpa', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button onClick={add} className="add-entry-btn">
        + Add Education
      </button>
    </div>
  );
}
