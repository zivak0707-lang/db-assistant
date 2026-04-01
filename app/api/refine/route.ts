import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { currentSchema, userMessage, dbType = 'MySQL' } = await req.json()

    if (!currentSchema || !userMessage) {
      return NextResponse.json({ error: 'Відсутня схема або повідомлення' }, { status: 400 })
    }
    if (userMessage.trim().length < 3) {
      return NextResponse.json({ error: 'Повідомлення занадто коротке' }, { status: 400 })
    }

    const systemPrompt = `You are a database design expert helping to refine an existing database schema.
The user will provide their current schema and a request to modify it.
Return ONLY valid JSON in the same format as the original schema — no text, no markdown.

Format:
{
  "er_diagram": "erDiagram\\n...",
  "tables": [...],
  "sql": "CREATE TABLE ...;",
  "explanation": "Що було змінено і чому (українською)"
}

Rules:
- Keep all existing tables unless user explicitly asks to remove them
- ALL table/column names in English snake_case ONLY
- Generate SQL for: ${dbType}
- Return complete updated schema, not just the changes
- ONLY JSON`

    const userPrompt = `Current schema:
${JSON.stringify(currentSchema, null, 2)}

User request: ${userMessage.trim()}

Update the schema according to the request and return the complete updated version.`

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
    console.error('Refine Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Помилка уточнення. Спробуйте ще раз.' }, { status: 500 })
  }
}