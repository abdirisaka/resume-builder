import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const isPDF = file.type === 'application/pdf';

    const prompt = `You are a CV/resume parser. Extract all information from this CV and return it as a single JSON object with exactly this structure. Do not include any text outside the JSON.

{
  "personal": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": ""
  },
  "summary": "",
  "experience": [
    {
      "id": "1",
      "company": "",
      "title": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": ["bullet point 1", "bullet point 2"]
    }
  ],
  "education": [
    {
      "id": "1",
      "school": "",
      "degree": "",
      "field": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "gpa": ""
    }
  ],
  "skills": ["skill1", "skill2"]
}

Rules:
- Dates must be in YYYY-MM format (e.g. 2022-03). If only year is known use YYYY-01.
- If currently working somewhere, set current: true and endDate: ""
- Split responsibilities into separate bullet points in the description array
- Extract all skills as individual strings in the skills array
- If a field is unknown leave it as empty string
- Return only valid JSON, nothing else`;

    let response;

    if (isPDF) {
      response = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 }
            },
            { type: 'text', text: prompt }
          ]
        }]
      });
    } else {
      // Image (PNG, JPG)
      const mediaType = file.type as 'image/png' | 'image/jpeg' | 'image/webp';
      response = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 }
            },
            { type: 'text', text: prompt }
          ]
        }]
      });
    }

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error('CV parse error:', err);
    return NextResponse.json({ error: 'Failed to parse CV' }, { status: 500 });
  }
}
