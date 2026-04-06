import { ResumeData } from '@/types/resume';
import { emptyResume } from '@/data/emptyResume';

const STORAGE_KEY = 'resumebuilder_v1';

export function saveResume(data: ResumeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save resume to localStorage:', e);
  }
}

export function loadResume(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResume;
    return JSON.parse(raw) as ResumeData;
  } catch (e) {
    console.warn('Failed to load resume from localStorage:', e);
    return emptyResume;
  }
}

export function clearResume(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear resume from localStorage:', e);
  }
}
