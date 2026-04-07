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

export default function MinimalTemplate({ data }: Props) {
  const { personal: p, summary, experience, education, skills } = data;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  const hasExp = experience.some(e => e.company || e.title);
  const hasEdu = education.some(e => e.school);

  return (
    <div className="min-resume" id="resume-preview">
      <header className="min-header">
        {p.fullName && <h1 className="min-name">{p.fullName}</h1>}
        {contact.length > 0 && (
          <div className="min-contact">
            {contact.map((c, i) => <span key={i}>{i > 0 && <span className="min-dot">·</span>}{c}</span>)}
          </div>
        )}
      </header>

      {summary && (
        <section className="min-section">
          <p className="min-summary">{summary}</p>
        </section>
      )}

      {hasExp && (
        <section className="min-section">
          <h2 className="min-heading">Experience</h2>
          {experience.filter(e => e.company || e.title).map(e => (
            <div key={e.id} className="min-entry">
              <div className="min-entry-top">
                <div>
                  <span className="min-role">{e.title}</span>
                  {e.company && <span className="min-company">, {e.company}</span>}
                </div>
                <span className="min-date">{range(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.description.filter(Boolean).length > 0 && (
                <ul className="min-bullets">
                  {e.description.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {hasEdu && (
        <section className="min-section">
          <h2 className="min-heading">Education</h2>
          {education.filter(e => e.school).map(e => (
            <div key={e.id} className="min-entry">
              <div className="min-entry-top">
                <div>
                  <span className="min-role">{[e.degree, e.field].filter(Boolean).join(' in ') || e.school}</span>
                  {(e.degree || e.field) && <span className="min-company">, {e.school}</span>}
                  {e.gpa && <span className="min-company"> · {e.gpa}</span>}
                </div>
                <span className="min-date">{range(e.startDate, e.endDate, e.current)}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="min-section">
          <h2 className="min-heading">Skills</h2>
          <p className="min-skills">{skills.join(' · ')}</p>
        </section>
      )}
    </div>
  );
}
