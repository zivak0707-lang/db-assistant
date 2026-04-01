import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `You are a database design expert.
The user describes a subject area in any language.
You return ONLY valid JSON — no text before or after, no markdown blocks.

Response format:
{
  "er_diagram": "erDiagram\\n  ENTITY1 {\\n    int id PK\\n  }\\n  ENTITY1 ||--o{ ENTITY2 : has",
  "tables": [
    {
      "name": "table_name",
      "description": "опис таблиці українською",
      "columns": [
        {
          "name": "id",
          "type": "INT",
          "constraints": "PRIMARY KEY AUTO_INCREMENT",
          "description": "унікальний ідентифікатор"
        }
      ]
    }
  ],
  "sql": "CREATE TABLE ...;\\n\\nCREATE TABLE ...;"
}

Strict rules:
- er_diagram — strictly valid Mermaid erDiagram syntax
- ALL table names and column names MUST be in English snake_case only: customer_name NOT імя, order_date NOT дата
- NO Cyrillic, NO apostrophes, NO special characters in table/column names ever
- sql — full MySQL DDL with all CREATE TABLE statements
- Always add: PRIMARY KEY, FOREIGN KEY, NOT NULL where needed
- 3 to 6 tables for any subject area
- descriptions in tables array can be in Ukrainian
- ONLY JSON in response — nothing else`

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json()

    if (!domain || domain.trim().length < 5) {
      return NextResponse.json(
        { error: 'Опишіть предметну область детальніше' },
        { status: 400 }
      )
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: domain.trim() }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: 'Порожня відповідь від AI' },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(content)

    if (!parsed.er_diagram || !parsed.tables || !parsed.sql) {
      return NextResponse.json(
        { error: 'Неповна відповідь від AI. Спробуйте ще раз.' },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)

  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Помилка генерації. Перевірте підключення і спробуйте ще раз.' },
      { status: 500 }
    )
  }
}