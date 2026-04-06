import { ResumeData } from '@/types/resume';

const EXPORT_VERSION = 1;

interface ResumeExportFile {
  version: number;
  exportedAt: string;
  resume: ResumeData;
}

export function exportResumeJSON(data: ResumeData): void {
  const payload: ResumeExportFile = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    resume: data,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const name = data.personal.fullName
    ? `${data.personal.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.json`
    : 'resume.json';
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function importResumeJSON(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as Partial<ResumeExportFile>;

        // Support both a wrapped export file and a raw ResumeData object
        const resume: ResumeData = parsed.resume ?? (parsed as unknown as ResumeData);

        // Minimal shape validation
        if (!resume.personal || !Array.isArray(resume.experience) || !Array.isArray(resume.education)) {
          throw new Error('File does not look like a valid ResumeForge export.');
        }

        resolve(resume);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Failed to parse JSON file.'));
      }
    };

    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsText(file);
  });
}
