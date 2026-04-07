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

export default function CreativeTemplate({ data }: Props) {
  const { personal: p, summary, experience, education, skills } = data;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);
  const hasExp = experience.some(e => e.company || e.title);
  const hasEdu = education.some(e => e.school);
  const initials = p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="cre-resume" id="resume-preview">
      {/* Left sidebar */}
      <div className="cre-sidebar">
        <div className="cre-name-block">
          {initials && <div className="cre-initials">{initials}</div>}
          {p.fullName && <h1 className="cre-name">{p.fullName}</h1>}
        </div>

        {contact.length > 0 && (
          <div className="cre-contact-block">
            <h2 className="cre-side-title">Contact</h2>
            {contact.map((c, i) => <p key={i} className="cre-contact-item">{c}</p>)}
          </div>
        )}

        {skills.length > 0 && (
          <div className="cre-contact-block">
            <h2 className="cre-side-title">Skills</h2>
            <div className="cre-skills">
              {skills.map((s, i) => <span key={i} className="cre-skill-tag">{s}</span>)}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="cre-main">
        {summary && (
          <section className="cre-section">
            <h2 className="cre-section-title">Profile</h2>
            <p className="cre-summary">{summary}</p>
          </section>
        )}

        {hasExp && (
          <section className="cre-section">
            <h2 className="cre-section-title">Experience</h2>
            {experience.filter(e => e.company || e.title).map(e => (
              <div key={e.id} className="cre-entry">
                <div className="cre-entry-dot" />
                <div className="cre-entry-content">
                  <div className="cre-entry-header">
                    <div>
                      <div className="cre-entry-title">{e.title}</div>
                      <div className="cre-entry-sub">{e.company}</div>
                    </div>
                    <div className="cre-entry-date">{range(e.startDate, e.endDate, e.current)}</div>
                  </div>
                  {e.description.filter(Boolean).length > 0 && (
                    <ul className="cre-bullets">
                      {e.description.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {hasEdu && (
          <section className="cre-section">
            <h2 className="cre-section-title">Education</h2>
            {education.filter(e => e.school).map(e => (
              <div key={e.id} className="cre-entry">
                <div className="cre-entry-dot" />
                <div className="cre-entry-content">
                  <div className="cre-entry-header">
                    <div>
                      <div className="cre-entry-title">{[e.degree, e.field].filter(Boolean).join(' in ') || e.school}</div>
                      <div className="cre-entry-sub">{e.school}{e.gpa ? ` · ${e.gpa}` : ''}</div>
                    </div>
                    <div className="cre-entry-date">{range(e.startDate, e.endDate, e.current)}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
