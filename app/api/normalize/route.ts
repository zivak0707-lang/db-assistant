import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { tables } = await req.json()

    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return NextResponse.json({ error: 'Таблиці не передані' }, { status: 400 })
    }

    const systemPrompt = `You are a database normalization expert.
Analyze the given database schema and check its normal forms.
Return ONLY valid JSON — no text, no markdown.

Format:
{
  "overall": "1NF" | "2NF" | "3NF" | "BCNF",
  "score": 85,
  "issues": [
    {
      "table": "table_name",
      "form": "2NF",
      "problem": "опис проблеми українською",
      "suggestion": "як виправити українською"
    }
  ],
  "summary": "загальний висновок українською (2-3 речення)"
}

Rules:
- overall = lowest normal form achieved by the entire schema
- score = 0-100, how well normalized the schema is
- issues = list of normalization problems found (empty array if none)
- Be specific about which columns cause issues
- ONLY JSON`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    let response
    try {
      response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this schema:\n${JSON.stringify(tables, null, 2)}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 2000,
      })
    } finally {
      clearTimeout(timeout)
    }

    const content = response.choices[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'Порожня відповідь від AI' }, { status: 500 })

    let parsed
    try { parsed = JSON.parse(content) }
    catch { return NextResponse.json({ error: 'AI повернув некоректний формат' }, { status: 500 }) }

    return NextResponse.json(parsed)

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Час очікування вичерпано.' }, { status: 504 })
    }
    console.error('Normalize Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Помилка аналізу. Спробуйте ще раз.' }, { status: 500 })
  }
}