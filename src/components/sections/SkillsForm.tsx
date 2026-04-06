'use client';

import { useState } from 'react';

interface Props {
  data: string[];
  onChange: (data: string[]) => void;
}

export default function SkillsForm({ data, onChange }: Props) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.includes(trimmed)) {
      onChange([...data, trimmed]);
    }
    setInputValue('');
  };

  const removeSkill = (skill: string) => {
    onChange(data.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  // Handle paste of comma-separated skills
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',')) {
      e.preventDefault();
      const skills = pasted.split(',').map((s) => s.trim()).filter(Boolean);
      const unique = skills.filter((s) => !data.includes(s));
      if (unique.length > 0) onChange([...data, ...unique]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Add Skills</label>
        <div className="flex gap-2">
          <input
            className="form-input flex-1"
            placeholder="Type a skill and press Enter (or paste comma-separated)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
          <button
            onClick={() => addSkill(inputValue)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-400">Press Enter or comma to add. You can also paste a comma-separated list.</p>
      </div>

      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <span key={skill} className="skill-tag group">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {data.length === 0 && (
        <p className="text-sm text-slate-400 italic">No skills added yet.</p>
      )}
    </div>
  );
}
