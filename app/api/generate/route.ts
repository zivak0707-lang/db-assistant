import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

function buildPrompt(dbType: string) {
  const syntaxMap: Record<string, string> = {
    MySQL: 'MySQL with AUTO_INCREMENT, ENGINE=InnoDB, types: VARCHAR, INT, DATETIME, DECIMAL, TEXT',
    PostgreSQL: 'PostgreSQL with SERIAL PRIMARY KEY, types: VARCHAR, INTEGER, TIMESTAMP, NUMERIC, TEXT',
    SQLite: 'SQLite with INTEGER PRIMARY KEY AUTOINCREMENT, types: TEXT, INTEGER, REAL, BLOB',
  }
  return `You are a database design expert.
The user describes a subject area in any language.
Return ONLY valid JSON — no text before or after, no markdown.

Format:
{
  "er_diagram": "erDiagram\\n  ENTITY {\\n    int id PK\\n  }\\n  ENTITY ||--o{ OTHER : has",
  "tables": [
    {
      "name": "table_name",
      "description": "опис українською",
      "columns": [
        { "name": "id", "type": "INT", "constraints": "PRIMARY KEY AUTO_INCREMENT", "description": "унікальний ідентифікатор" }
      ]
    }
  ],
  "sql": "CREATE TABLE ...;\\n\\nCREATE TABLE ...;",
  "explanation": "2-3 речення українською — чому така структура"
}

Rules:
- SQL for: ${syntaxMap[dbType] || syntaxMap['MySQL']}
- er_diagram — valid Mermaid erDiagram syntax only
- ALL table/column names in English snake_case ONLY — no Cyrillic ever
- PRIMARY KEY, FOREIGN KEY, NOT NULL where needed
- 3 to 6 tables
- ONLY JSON — nothing else`
}

const ALLOWED_DB_TYPES = ['MySQL', 'PostgreSQL', 'SQLite']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { domain, dbType = 'MySQL' } = body

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: "Поле domain обов'язкове" }, { status: 400 })
    }
    const trimmed = domain.trim()
    if (trimmed.length < 5) {
      return NextResponse.json({ error: 'Опишіть детальніше (мінімум 5 символів)' }, { status: 400 })
    }
    if (trimmed.length > 500) {
      return NextResponse.json({ error: 'Занадто довго. Максимум 500 символів' }, { status: 400 })
    }
    if (!ALLOWED_DB_TYPES.includes(dbType)) {
      return NextResponse.json({ error: 'Невірний тип БД' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    let response
    try {
      response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: buildPrompt(dbType) },
          { role: 'user', content: trimmed }
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
      return NextResponse.json({ error: 'Неповна відповідь від AI. Спробуйте ще раз.' }, { status: 500 })
    }
    if (!Array.isArray(parsed.tables) || parsed.tables.length === 0) {
      return NextResponse.json({ error: 'AI не згенерував таблиці. Опишіть детальніше.' }, { status: 500 })
    }

    return NextResponse.json({ ...parsed, dbType })

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Час очікування вичерпано. Спробуйте ще раз.' }, { status: 504 })
    }
    console.error('API Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Помилка генерації. Спробуйте ще раз.' }, { status: 500 })
  }
}