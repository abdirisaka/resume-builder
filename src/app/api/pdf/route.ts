import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/types/resume';
import { buildResumeHTML } from '@/lib/buildResumeHTML';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let data: { resume: ResumeData; template: string };

  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { resume, template } = data;
  if (!resume || !template) {
    return NextResponse.json({ error: 'Missing resume or template field' }, { status: 400 });
  }

  const html = buildResumeHTML(resume, template);

  let browser;
  try {
    const puppeteer = await import('puppeteer-core');
    let executablePath: string;

    if (process.env.NODE_ENV === 'production') {
      const chromium = await import('@sparticuz/chromium');
      executablePath = await chromium.default.executablePath();
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath,
        headless: true,
      });
    } else {
      const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      ];
      const fs = await import('fs');
      executablePath = possiblePaths.find((p) => {
        try { return fs.existsSync(p); } catch { return false; }
      }) ?? '';

      if (!executablePath) {
        return NextResponse.json(
          { error: 'No local Chrome found. PDF will fall back to browser print.' },
          { status: 500 }
        );
      }

      browser = await puppeteer.default.launch({
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
