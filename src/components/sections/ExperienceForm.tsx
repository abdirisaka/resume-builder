'use client';

import { ExperienceEntry } from '@/types/resume';
import { nanoid } from 'nanoid';

interface Props {
  data: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
}

function emptyEntry(): ExperienceEntry {
  return {
    id: nanoid(),
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    current: false,
    description: [''],
  };
}

export default function ExperienceForm({ data, onChange }: Props) {
  const add = () => onChange([...data, emptyEntry()]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));

  const update = (id: string, field: keyof ExperienceEntry, value: unknown) => {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const updateBullet = (id: string, index: number, value: string) => {
    const entry = data.find((e) => e.id === id);
    if (!entry) return;
    const description = [...entry.description];
    description[index] = value;
    update(id, 'description', description);
  };

  const addBullet = (id: string) => {
    const entry = data.find((e) => e.id === id);
    if (!entry) return;
    update(id, 'description', [...entry.description, '']);
  };

  const removeBullet = (id: string, index: number) => {
    const entry = data.find((e) => e.id === id);
    if (!entry) return;
    const description = entry.description.filter((_, i) => i !== index);
    update(id, 'description', description.length === 0 ? [''] : description);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...data];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onChange(arr);
  };

  const moveDown = (index: number) => {
    if (index === data.length - 1) return;
    const arr = [...data];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-6">
      {data.map((entry, index) => (
        <div key={entry.id} className="entry-card">
          <div className="entry-card-header">
            <span className="entry-card-title">
              {entry.title || entry.company || `Experience ${index + 1}`}
            </span>
            <div className="entry-card-actions">
              <button onClick={() => moveUp(index)} disabled={index === 0} className="icon-btn" title="Move up">↑</button>
              <button onClick={() => moveDown(index)} disabled={index === data.length - 1} className="icon-btn" title="Move down">↓</button>
              <button onClick={() => remove(entry.id)} className="icon-btn icon-btn-danger" title="Remove">✕</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Job Title *</label>
              <input className="form-input" placeholder="Senior Engineer" value={entry.title}
                onChange={(e) => update(entry.id, 'title', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Company *</label>
              <input className="form-input" placeholder="Acme Corp" value={entry.company}
                onChange={(e) => update(entry.id, 'company', e.target.value)} />
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
                Currently working here
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="form-label">Key Achievements / Responsibilities</label>
            <div className="space-y-2">
              {entry.description.map((bullet, bi) => (
                <div key={bi} className="flex gap-2 items-start">
                  <span className="mt-2.5 text-slate-400 text-sm">•</span>
                  <input
                    className="form-input flex-1"
                    placeholder="Achieved X by doing Y, resulting in Z..."
                    value={bullet}
                    onChange={(e) => updateBullet(entry.id, bi, e.target.value)}
                  />
                  <button onClick={() => removeBullet(entry.id, bi)}
                    className="mt-2 icon-btn icon-btn-danger" title="Remove bullet">✕</button>
                </div>
              ))}
            </div>
            <button onClick={() => addBullet(entry.id)} className="add-bullet-btn mt-2">
              + Add bullet point
            </button>
          </div>
        </div>
      ))}

      <button onClick={add} className="add-entry-btn">
        + Add Work Experience
      </button>
    </div>
  );
}
