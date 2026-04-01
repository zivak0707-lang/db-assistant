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
    const { tables } = await req.json()
    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return NextResponse.json({ error: 'Таблиці не передані' }, { status: 400 })
    }

    const systemPrompt = `You are a database normalization expert.
Analyze the schema and check normal forms.
Return ONLY valid JSON — no text, no markdown.

Format:
{
  "overall": "3NF",
  "score": 85,
  "issues": [
    { "table": "name", "form": "2NF", "problem": "опис українською", "suggestion": "рекомендація українською" }
  ],
  "summary": "загальний висновок українською"
}

Rules:
- overall = lowest normal form achieved
- score = 0-100
- issues = empty array if no problems
- ONLY JSON`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    let response
    try {
      response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze:\n${JSON.stringify(tables, null, 2)}` }
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
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('rate_limit_exceeded') || errMsg.includes('429')) {
      const retryAfter = parseRetryAfter(errMsg)
      return NextResponse.json({ error: 'Ліміт запитів вичерпано', rateLimited: true, retryAfter }, { status: 429 })
    }
    console.error('Normalize Error:', errMsg)
    return NextResponse.json({ error: 'Помилка аналізу. Спробуйте ще раз.' }, { status: 500 })
  }
}