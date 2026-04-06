import { ResumeData } from '@/types/resume';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateResume(data: ResumeData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.personal.fullName.trim()) {
    errors.push('Full name is required.');
  }
  if (!data.personal.email.trim()) {
    errors.push('Email address is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email)) {
    errors.push('Email address does not look valid.');
  }

  // Warnings — not blockers, but helpful
  if (!data.summary.trim()) {
    warnings.push('No professional summary — recruiters read this first.');
  }
  if (data.experience.length === 0) {
    warnings.push('No work experience entries added.');
  }
  if (data.skills.length === 0) {
    warnings.push('No skills listed — ATS systems often filter on these.');
  }
  if (!data.personal.phone.trim()) {
    warnings.push('No phone number provided.');
  }

  // Experience quality checks
  data.experience.forEach((e, i) => {
    if (e.description.filter(Boolean).length === 0) {
      warnings.push(`Experience ${i + 1} (${e.title || e.company || 'Untitled'}) has no bullet points.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
