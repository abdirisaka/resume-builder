import { ResumeData } from '@/types/resume';

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function dateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

function classicCSS(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.45;
      color: #1a1a1a;
      background: white;
    }
    .resume {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
    }
    header { text-align: center; margin-bottom: 14pt; }
    h1 { font-size: 22pt; font-weight: 700; font-family: Georgia, serif; margin-bottom: 5pt; }
    .contact {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      color: #444;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4pt;
    }
    .sep { color: #aaa; margin: 0 2pt; }
    section { margin-bottom: 13pt; }
    h2 {
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 3pt;
    }
    .line { border-top: 1.5pt solid #1a1a1a; margin-bottom: 7pt; }
    p.summary { font-size: 9.5pt; color: #333; line-height: 1.5; }
    .entry { margin-bottom: 9pt; }
    .entry:last-child { margin-bottom: 0; }
    .entry-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8pt; margin-bottom: 3pt; }
    .entry-title { font-family: Arial, sans-serif; font-weight: 700; font-size: 10pt; }
    .entry-sub { font-size: 9.5pt; color: #555; font-style: italic; }
    .entry-date { font-family: Arial, sans-serif; font-size: 9pt; color: #555; white-space: nowrap; flex-shrink: 0; }
    ul { padding-left: 14pt; list-style-type: disc; margin-top: 3pt; }
    li { font-size: 9.5pt; color: #333; line-height: 1.5; margin-bottom: 2pt; }
    .skills { font-family: Arial, sans-serif; font-size: 9.5pt; color: #333; line-height: 1.6; }
  `;
}

function modernCSS(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, 'Helvetica Neue', sans-serif; font-size: 10pt; line-height: 1.45; color: #1a1a1a; background: white; }
    .resume { width: 210mm; min-height: 297mm; }
    header { background: #1e293b; color: white; padding: 22pt 30pt 18pt; }
    h1 { font-size: 22pt; font-weight: 700; color: white; margin-bottom: 7pt; }
    .contact { display: flex; flex-wrap: wrap; gap: 5pt 14pt; }
    .contact span { font-size: 8.5pt; color: #94a3b8; }
    .body { display: flex; min-height: calc(297mm - 60pt); }
    .main { flex: 1; padding: 20pt 24pt 20pt 30pt; border-right: 1pt solid #e2e8f0; }
    .sidebar { width: 150pt; flex-shrink: 0; padding: 20pt 16pt; background: #f8fafc; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    section { margin-bottom: 16pt; }
    h2 { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #1e293b; border-bottom: 2pt solid #1e293b; padding-bottom: 3pt; margin-bottom: 9pt; }
    p.summary { font-size: 9.5pt; color: #374151; line-height: 1.55; }
    .entry { margin-bottom: 11pt; }
    .entry:last-child { margin-bottom: 0; }
    .entry-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8pt; margin-bottom: 3pt; }
    .entry-title { font-weight: 700; font-size: 10pt; color: #111827; }
    .entry-sub { font-size: 9pt; color: #6b7280; margin-top: 1pt; }
    .entry-date { font-size: 8.5pt; color: #9ca3af; white-space: nowrap; margin-top: 1pt; }
    ul { padding-left: 12pt; list-style-type: disc; margin-top: 4pt; }
    li { font-size: 9pt; color: #374151; line-height: 1.5; margin-bottom: 2pt; }
    .sidebar h2 { font-size: 8.5pt; }
    .skill { display: inline-block; font-size: 8.5pt; background: #e2e8f0; color: #1e293b; padding: 2pt 7pt; border-radius: 3pt; font-weight: 500; margin: 0 0 4pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sidebar-text { font-size: 8.5pt; color: #6b7280; line-height: 1.5; margin-bottom: 3pt; word-break: break-word; }
  `;
}

function classicBody(r: ResumeData): string {
  const { personal: p, summary, experience, education, skills } = r;
  const contact = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);

  return `
    <div class="resume">
      <header>
        ${p.fullName ? `<h1>${esc(p.fullName)}</h1>` : ''}
        ${contact.length ? `<div class="contact">${contact.map((c, i) =>
          i === 0 ? esc(c) : `<span class="sep">·</span>${esc(c)}`).join('')}</div>` : ''}
      </header>

      ${summary ? `
        <section>
          <h2>Professional Summary</h2>
          <div class="line"></div>
          <p class="summary">${esc(summary)}</p>
        </section>` : ''}

      ${experience.filter(e => e.company || e.title).length ? `
        <section>
          <h2>Work Experience</h2>
          <div class="line"></div>
          ${experience.filter(e => e.company || e.title).map(e => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${esc(e.title)}</div>
                  <div class="entry-sub">${esc(e.company)}</div>
                </div>
                <div class="entry-date">${esc(dateRange(e.startDate, e.endDate, e.current))}</div>
              </div>
              ${e.description.filter(Boolean).length ? `
                <ul>${e.description.filter(Boolean).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
            </div>`).join('')}
        </section>` : ''}

      ${education.filter(e => e.school).length ? `
        <section>
          <h2>Education</h2>
          <div class="line"></div>
          ${education.filter(e => e.school).map(e => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${esc([e.degree, e.field].filter(Boolean).join(' in ') || e.school)}</div>
                  <div class="entry-sub">${esc(e.school)}${e.gpa ? ` · ${esc(e.gpa)}` : ''}</div>
                </div>
                <div class="entry-date">${esc(dateRange(e.startDate, e.endDate, e.current))}</div>
              </div>
            </div>`).join('')}
        </section>` : ''}

      ${skills.length ? `
        <section>
          <h2>Skills</h2>
          <div class="line"></div>
          <p class="skills">${esc(skills.join(' · '))}</p>
        </section>` : ''}
    </div>
  `;
}

function modernBody(r: ResumeData): string {
  const { personal: p, summary, experience, education, skills } = r;
  const contact = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);

  return `
    <div class="resume">
      <header>
        ${p.fullName ? `<h1>${esc(p.fullName)}</h1>` : ''}
        ${contact.length ? `<div class="contact">${contact.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
      </header>
      <div class="body">
        <div class="main">
          ${summary ? `<section><h2>Profile</h2><p class="summary">${esc(summary)}</p></section>` : ''}

          ${experience.filter(e => e.company || e.title).length ? `
            <section>
              <h2>Experience</h2>
              ${experience.filter(e => e.company || e.title).map(e => `
                <div class="entry">
                  <div class="entry-row">
                    <div>
                      <div class="entry-title">${esc(e.title)}</div>
                      <div class="entry-sub">${esc(e.company)}</div>
                    </div>
                    <div class="entry-date">${esc(dateRange(e.startDate, e.endDate, e.current))}</div>
                  </div>
                  ${e.description.filter(Boolean).length ? `
                    <ul>${e.description.filter(Boolean).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
                </div>`).join('')}
            </section>` : ''}

          ${education.filter(e => e.school).length ? `
            <section>
              <h2>Education</h2>
              ${education.filter(e => e.school).map(e => `
                <div class="entry">
                  <div class="entry-row">
                    <div>
                      <div class="entry-title">${esc([e.degree, e.field].filter(Boolean).join(' in ') || e.school)}</div>
                      <div class="entry-sub">${esc(e.school)}${e.gpa ? ` · ${esc(e.gpa)}` : ''}</div>
                    </div>
                    <div class="entry-date">${esc(dateRange(e.startDate, e.endDate, e.current))}</div>
                  </div>
                </div>`).join('')}
            </section>` : ''}
        </div>

        <div class="sidebar">
          ${skills.length ? `
            <section>
              <h2>Skills</h2>
              ${skills.map(s => `<div><span class="skill">${esc(s)}</span></div>`).join('')}
            </section>` : ''}

          ${p.location ? `<section><h2>Location</h2><p class="sidebar-text">${esc(p.location)}</p></section>` : ''}

          ${(p.linkedin || p.website) ? `
            <section>
              <h2>Links</h2>
              ${p.linkedin ? `<p class="sidebar-text">${esc(p.linkedin)}</p>` : ''}
              ${p.website ? `<p class="sidebar-text">${esc(p.website)}</p>` : ''}
            </section>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function buildResumeHTML(resume: ResumeData, template: string): string {
  const css = template === 'modern' ? modernCSS() : classicCSS();
  const body = template === 'modern' ? modernBody(resume) : classicBody(resume);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>${body}</body>
</html>`;
}
