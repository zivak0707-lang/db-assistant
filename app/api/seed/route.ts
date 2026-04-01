import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { tables, dbType = 'MySQL' } = await req.json()

    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return NextResponse.json({ error: 'Таблиці не передані' }, { status: 400 })
    }

    const systemPrompt = `You are a database expert. Generate realistic test INSERT data.
Return ONLY valid JSON — no text, no markdown.

Format:
{
  "seed_sql": "-- Test data\\nINSERT INTO table1 ...;\\nINSERT INTO table2 ...;"
}

Rules:
- Generate 5 realistic rows per table
- Use proper SQL syntax for ${dbType}
- Respect foreign key relationships — insert parent rows first
- Use realistic Ukrainian names, emails, dates where appropriate
- Column names are in English, but values can be realistic data
- ONLY JSON`

    const userPrompt = `Generate INSERT test data for these tables:
${JSON.stringify(tables, null, 2)}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    let response
    try {
      response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 3000,
      })
    } finally {
      clearTimeout(timeout)
    }

    const content = response.choices[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'Порожня відповідь від AI' }, { status: 500 })

    let parsed
    try { parsed = JSON.parse(content) }
    catch { return NextResponse.json({ error: 'AI повернув некоректний формат' }, { status: 500 }) }

    if (!parsed.seed_sql) {
      return NextResponse.json({ error: 'AI не згенерував дані. Спробуйте ще раз.' }, { status: 500 })
    }

    return NextResponse.json(parsed)

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Час очікування вичерпано.' }, { status: 504 })
    }
    console.error('Seed Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Помилка генерації даних. Спробуйте ще раз.' }, { status: 500 })
  }
}