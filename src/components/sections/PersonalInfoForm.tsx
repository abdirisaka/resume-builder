'use client';

import { PersonalInfo } from '@/types/resume';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, onChange }: Props) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Full Name *</label>
          <input
            className="form-input"
            placeholder="Alex Johnson"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Email *</label>
          <input
            className="form-input"
            type="email"
            placeholder="alex@example.com"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            placeholder="+44 7700 900123"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Location</label>
          <input
            className="form-input"
            placeholder="London, UK"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Website</label>
          <input
            className="form-input"
            placeholder="yoursite.com"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">LinkedIn</label>
          <input
            className="form-input"
            placeholder="linkedin.com/in/yourname"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
