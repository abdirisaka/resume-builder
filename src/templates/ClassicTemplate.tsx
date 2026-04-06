import { ResumeData } from '@/types/resume';

interface Props {
  data: ResumeData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function formatDateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

export default function ClassicTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills } = data;

  const hasName = personal.fullName.trim();
  const contactParts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
  ].filter(Boolean);

  const hasExperience = experience.some((e) => e.company || e.title);
  const hasEducation = education.some((e) => e.school);
  const hasSkills = skills.length > 0;
  const hasSummary = summary.trim();

  if (!hasName && !hasSummary && !hasExperience && !hasEducation && !hasSkills) {
    return (
      <div className="resume-empty-state">
        <div className="text-center text-slate-400">
          <svg className="mx-auto mb-3 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">Your resume preview will appear here</p>
          <p className="text-xs mt-1 opacity-70">Start filling in the form on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classic-resume" id="resume-preview">
      {/* Header */}
      <header className="resume-header">
        {hasName && <h1 className="resume-name">{personal.fullName}</h1>}
        {contactParts.length > 0 && (
          <div className="resume-contact">
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="resume-contact-sep">·</span>}
                {part}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {hasSummary && (
        <section className="resume-section">
          <h2 className="resume-section-title">Professional Summary</h2>
          <div className="resume-section-line" />
          <p className="resume-summary">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {hasExperience && (
        <section className="resume-section">
          <h2 className="resume-section-title">Work Experience</h2>
          <div className="resume-section-line" />
          {experience.filter((e) => e.company || e.title).map((entry) => (
            <div key={entry.id} className="resume-entry">
              <div className="resume-entry-header">
                <div>
                  <div className="resume-entry-title">{entry.title}</div>
                  <div className="resume-entry-subtitle">{entry.company}</div>
                </div>
                <div className="resume-entry-date">
                  {formatDateRange(entry.startDate, entry.endDate, entry.current)}
                </div>
              </div>
              {entry.description.filter(Boolean).length > 0 && (
                <ul className="resume-bullets">
                  {entry.description.filter(Boolean).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          <div className="resume-section-line" />
          {education.filter((e) => e.school).map((entry) => (
            <div key={entry.id} className="resume-entry">
              <div className="resume-entry-header">
                <div>
                  <div className="resume-entry-title">
                    {[entry.degree, entry.field].filter(Boolean).join(' in ') || entry.school}
                  </div>
                  <div className="resume-entry-subtitle">
                    {entry.school}
                    {entry.gpa ? ` · ${entry.gpa}` : ''}
                  </div>
                </div>
                <div className="resume-entry-date">
                  {formatDateRange(entry.startDate, entry.endDate, entry.current)}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="resume-section-line" />
          <p className="resume-skills-list">{skills.join(' · ')}</p>
        </section>
      )}
    </div>
  );
}
