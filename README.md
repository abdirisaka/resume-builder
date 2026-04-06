# ResumeForge

**A free, open-source resume builder with no paywalls and no sign-up required.**

Build a professional ATS-friendly resume, choose from multiple templates, and export to PDF — all in the browser.

---

## Features

- **Live preview** — see your resume update in real time as you type
- **Two templates** — Classic (serif, traditional) and Modern (sidebar, clean sans-serif)
- **PDF export** — server-side via Puppeteer on Vercel; falls back to browser print in local dev
- **JSON export / import** — save your resume as a `.json` file and reload it any time
- **Local storage** — your data persists in the browser between sessions without an account
- **Undo / redo** — full history with `Ctrl+Z` / `Ctrl+Shift+Z`
- **Pre-download validation** — catches missing required fields and warns about common ATS weaknesses
- **Mobile-friendly** — Edit / Preview tab toggle on small screens
- **ATS-safe templates** — no columns with text boxes, no icons, no tables; clean linear HTML

---

## Tech Stack

| Layer     | Choice                                |
|-----------|---------------------------------------|
| Framework | Next.js 14 (App Router)               |
| Language  | TypeScript                            |
| Styling   | Tailwind CSS + custom CSS             |
| Storage   | `localStorage` (no database)          |
| PDF       | Puppeteer + `@sparticuz/chromium` (Vercel) / `window.print()` fallback |
| Hosting   | Vercel Hobby (free tier)              |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
git clone https://github.com/your-username/resume-builder.git
cd resume-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note on local PDF export:** The `/api/pdf` endpoint requires a local Chromium binary. If none is found at the standard paths, it automatically falls back to `window.print()`. Select **Save as PDF** in the print dialog with **Margins: None** for best results.

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Leave all build settings at their defaults — `vercel.json` handles the config.
4. Deploy.

The PDF API route is pre-configured with 1 GB memory and a 30-second timeout to handle Puppeteer cold starts.

No environment variables are required.

---

## Project Structure

```
src/
├── app/
│   ├── api/pdf/route.ts      # Server-side PDF generation endpoint
│   ├── globals.css            # All styles (Tailwind + template CSS + print CSS)
│   ├── layout.tsx
│   └── page.tsx               # Main app shell
│
├── components/
│   ├── ResumeForm.tsx          # Accordion form shell
│   ├── ResumePreview.tsx       # Preview panel + template picker + PDF download
│   ├── TemplatePicker.tsx      # Template selector with thumbnails
│   ├── ValidationPanel.tsx     # Pre-download validation modal
│   └── sections/
│       ├── PersonalInfoForm.tsx
│       ├── ExperienceForm.tsx  # Dynamic entries with bullet points
│       ├── EducationForm.tsx
│       └── SkillsForm.tsx      # Tag-based input with paste support
│
├── templates/
│   ├── ClassicTemplate.tsx     # Traditional serif layout
│   └── ModernTemplate.tsx      # Sidebar layout
│
├── lib/
│   ├── storage.ts              # localStorage helpers
│   ├── exportImport.ts         # JSON export/import
│   ├── buildResumeHTML.ts      # Server-side HTML renderer for Puppeteer
│   ├── useResumeHistory.ts     # Undo/redo via useReducer
│   └── validation.ts           # Pre-download validation rules
│
├── types/
│   └── resume.ts               # ResumeData TypeScript interfaces
│
└── data/
    └── emptyResume.ts          # Default empty state + sample resume
```

---

## Data Model

```typescript
interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    title: string;
    startDate: string;   // "YYYY-MM"
    endDate: string;
    current: boolean;
    description: string[];
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
  }[];
  skills: string[];
}
```

---

## Adding a New Template

1. Create `src/templates/YourTemplate.tsx` — accept `{ data: ResumeData }` as props.
2. Add the template's CSS to `src/app/globals.css`.
3. Register it in `src/components/TemplatePicker.tsx` — add an entry to the `TEMPLATES` array.
4. Import and render it in `src/components/ResumePreview.tsx`.
5. Add the server-side HTML renderer to `src/lib/buildResumeHTML.ts` for PDF export support.

---

## Roadmap

- [ ] Third template (Compact — one-page optimised)
- [ ] Section reordering via drag and drop
- [ ] Custom section support (Projects, Certifications, Languages)
- [ ] Shareable resume link (Vercel KV or Supabase)
- [ ] Cover letter builder
- [ ] AI-assisted bullet point rewriting (Anthropic API)
- [ ] Dark mode for the editor UI

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add X'`
4. Push and open a PR

---

## License

MIT — use it, fork it, build on it.
