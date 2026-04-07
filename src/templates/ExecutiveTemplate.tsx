import { ResumeData } from '@/types/resume';

interface Props { data: ResumeData; }

function fmt(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1] + ' ' + y;
}
function range(s: string, e: string, cur: boolean) {
  const a = fmt(s), b = cur ? 'Present' : fmt(e);
  return a && b ? `${a} – ${b}` : a || b;
}

export default function ExecutiveTemplate({ data }: Props) {
  const { personal: p, summary, experience, education, skills } = data;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);
  const hasExp = experience.some(e => e.company || e.title);
  const hasEdu = education.some(e => e.school);

  return (
    <div className="exe-resume" id="resume-preview">
      {/* Top gold bar */}
      <div className="exe-topbar" />

      <header className="exe-header">
        {p.fullName && <h1 className="exe-name">{p.fullName}</h1>}
        {contact.length > 0 && (
          <div className="exe-contact">
            {contact.map((c, i) => (
              <span key={i} className="exe-contact-item">
                {i > 0 && <span className="exe-sep">|</span>}
                {c}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="exe-divider" />

      {summary && (
        <section className="exe-section">
          <h2 className="exe-section-title">Executive Summary</h2>
          <p className="exe-summary">{summary}</p>
        </section>
      )}

      {hasExp && (
        <section className="exe-section">
          <h2 className="exe-section-title">Professional Experience</h2>
          {experience.filter(e => e.company || e.title).map(e => (
            <div key={e.id} className="exe-entry">
              <div className="exe-entry-header">
                <div>
                  <div className="exe-title">{e.title}</div>
                  <div className="exe-company">{e.company}</div>
                </div>
                <div className="exe-date">{range(e.startDate, e.endDate, e.current)}</div>
              </div>
              {e.description.filter(Boolean).length > 0 && (
                <ul className="exe-bullets">
                  {e.description.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {hasEdu && (
        <section className="exe-section">
          <h2 className="exe-section-title">Education</h2>
          {education.filter(e => e.school).map(e => (
            <div key={e.id} className="exe-entry">
              <div className="exe-entry-header">
                <div>
                  <div className="exe-title">{[e.degree, e.field].filter(Boolean).join(' in ') || e.school}</div>
                  <div className="exe-company">{e.school}{e.gpa ? ` · ${e.gpa}` : ''}</div>
                </div>
                <div className="exe-date">{range(e.startDate, e.endDate, e.current)}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="exe-section">
          <h2 className="exe-section-title">Core Competencies</h2>
          <div className="exe-skills-grid">
            {skills.map((s, i) => <span key={i} className="exe-skill">{s}</span>)}
          </div>
        </section>
      )}

      <div className="exe-bottombar" />
    </div>
  );
}
