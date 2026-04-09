import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'CV parsing not configured on server.' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Upload a PDF or image.' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Max file size is 10MB.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const isPDF = file.type === 'application/pdf';

    const prompt = `Parse this CV and return ONLY a JSON object. No markdown, no backticks, no explanation. Use this exact structure:
{"personal":{"fullName":"","email":"","phone":"","location":"","website":"","linkedin":""},"summary":"","experience":[{"id":"1","company":"","title":"","startDate":"YYYY-MM","endDate":"YYYY-MM","current":false,"description":["bullet"]}],"education":[{"id":"1","school":"","degree":"","field":"","startDate":"YYYY-MM","endDate":"YYYY-MM","current":false,"gpa":""}],"skills":["skill"]}`;

    const content = isPDF
      ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }, { type: 'text', text: prompt }]
      : [{ type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } }, { type: 'text', text: prompt }];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 4096, messages: [{ role: 'user', content }] }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Anthropic error:', err);
      return NextResponse.json({ error: 'Failed to read CV. Try again.' }, { status: 500 });
    }

    const result = await res.json();
    const text = result.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: 'Could not extract CV data. Try a clearer scan.' }, { status: 500 });

    const parsed = JSON.parse(match[0]);
    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error('CV parse error:', err);
    return NextResponse.json({ error: 'Failed to parse CV. Please try again.' }, { status: 500 });
  }
}
