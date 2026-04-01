import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

function parseRetryAfter(errorMessage: string): number | null {
  const match = errorMessage.match(/Please try again in (\d+)m([\d.]+)s/)
  if (match) return parseInt(match[1]) * 60 + parseFloat(match[2])
  const secMatch = errorMessage.match(/Please try again in ([\d.]+)s/)
  if (secMatch) return parseFloat(secMatch[1])
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { currentSchema, userMessage, dbType = 'MySQL' } = await req.json()
    if (!currentSchema || !userMessage) {
      return NextResponse.json({ error: 'Відсутня схема або повідомлення' }, { status: 400 })
    }

    const systemPrompt = `You are a database design expert helping to refine an existing database schema.
Return ONLY valid JSON in the same format — no text, no markdown.

Format:
{
  "er_diagram": "erDiagram\\n...",
  "tables": [...],
  "sql": "CREATE TABLE ...;",
  "explanation": "Що змінено (українською)"
}

Rules:
- Keep existing tables unless asked to remove them
- ALL table/column names in English snake_case ONLY
- Generate SQL for: ${dbType}
- Return complete updated schema
- ONLY JSON`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    let response
    try {
      response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Current schema:\n${JSON.stringify(currentSchema, null, 2)}\n\nRequest: ${userMessage.trim()}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000,
      })
    } finally {
      clearTimeout(timeout)
    }

    const content = response.choices[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'Порожня відповідь від AI' }, { status: 500 })

    let parsed
    try { parsed = JSON.parse(content) }
    catch { return NextResponse.json({ error: 'AI повернув некоректний формат' }, { status: 500 }) }

    if (!parsed.er_diagram || !parsed.tables || !parsed.sql) {
      return NextResponse.json({ error: 'Неповна відповідь. Спробуйте ще раз.' }, { status: 500 })
    }

    return NextResponse.json({ ...parsed, dbType })

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Час очікування вичерпано.' }, { status: 504 })
    }
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('rate_limit_exceeded') || errMsg.includes('429')) {
      const retryAfter = parseRetryAfter(errMsg)
      return NextResponse.json({ error: 'Ліміт запитів вичерпано', rateLimited: true, retryAfter }, { status: 429 })
    }
    console.error('Refine Error:', errMsg)
    return NextResponse.json({ error: 'Помилка уточнення. Спробуйте ще раз.' }, { status: 500 })
  }
}