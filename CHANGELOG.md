# Changelog

All notable changes to ResumeForge are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.2.0] — 2026-04-06

### Added
- **Modern template** — sidebar layout with dark header band; ideal for tech roles
- **Template picker** — dropdown with visual thumbnails to switch between Classic and Modern
- **Server-side PDF export** — `/api/pdf` endpoint using Puppeteer + `@sparticuz/chromium`; automatically falls back to `window.print()` in local dev
- **Spinning loader** on the Download PDF button during server-side generation
- **JSON export** — saves full resume as a `.json` file named after the candidate
- **JSON import** — loads a previously exported `.json` file; handles both wrapped export format and raw `ResumeData`
- **Import error banner** — shown inline in the form if a file fails to parse
- **Undo / redo** via `useReducer` history stack (up to 50 states); keyboard shortcuts `Ctrl+Z` and `Ctrl+Shift+Z`
- **Pre-download validation** — modal showing required field errors (blocking) and ATS improvement warnings (non-blocking)
- `buildResumeHTML.ts` — self-contained HTML/CSS renderer for Puppeteer with Classic and Modern variants
- `vercel.json` — deployment config with 1 GB memory and 30s timeout on the PDF function
- `README.md` — setup, deployment, project structure, data model, and roadmap
- `CHANGELOG.md` — this file

### Changed
- `ResumePreview` now uses server-side PDF fetch with a graceful `window.print()` fallback
- `page.tsx` now wires in `useResumeHistory` for full undo/redo support with keyboard shortcuts
- `ResumeForm` top actions now include Import JSON and Export JSON alongside Load Sample and Clear

---

## [0.1.0] — 2026-04-06

### Added
- Initial MVP
- Resume editor form with collapsible accordion sections
- Personal info, summary, work experience (with bullet points and reordering), education, and skills
- Classic template (serif, ATS-friendly)
- Live preview panel
- `localStorage` persistence with auto-save on every keystroke
- "Saved ✓" indicator
- Mobile Edit / Preview tab toggle
- Load Sample and Clear All actions
- `ResumeData` TypeScript interfaces
- Sample resume data for testing
