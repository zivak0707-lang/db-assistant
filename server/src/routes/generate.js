const express = require('express')
const Groq = require('groq-sdk')

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

function buildPrompt(dbType) {
  const syntaxMap = {
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

function parseRetryAfter(errorMessage) {
  const match = errorMessage.match(/Please try again in (\d+)m([\d.]+)s/)
  if (match) return parseInt(match[1]) * 60 + parseFloat(match[2])
  const secMatch = errorMessage.match(/Please try again in ([\d.]+)s/)
  if (secMatch) return parseFloat(secMatch[1])
  return null
}

const ALLOWED_DB_TYPES = ['MySQL', 'PostgreSQL', 'SQLite']

router.post('/', async (req, res) => {
  try {
    const { domain, dbType = 'MySQL' } = req.body

    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: "Поле domain обов'язкове" })
    }
    const trimmed = domain.trim()
    if (trimmed.length < 5) {
      return res.status(400).json({ error: 'Опишіть детальніше (мінімум 5 символів)' })
    }
    if (trimmed.length > 500) {
      return res.status(400).json({ error: 'Занадто довго. Максимум 500 символів' })
    }
    if (!ALLOWED_DB_TYPES.includes(dbType)) {
      return res.status(400).json({ error: 'Невірний тип БД' })
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildPrompt(dbType) },
        { role: 'user', content: trimmed },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return res.status(500).json({ error: 'Порожня відповідь від AI' })

    let parsed
    try { parsed = JSON.parse(content) } catch {
      return res.status(500).json({ error: 'AI повернув некоректний формат' })
    }

    if (!parsed.er_diagram || !parsed.tables || !parsed.sql) {
      return res.status(500).json({ error: 'Неповна відповідь від AI. Спробуйте ще раз.' })
    }
    if (!Array.isArray(parsed.tables) || parsed.tables.length === 0) {
      return res.status(500).json({ error: 'AI не згенерував таблиці. Опишіть детальніше.' })
    }

    return res.json({ ...parsed, dbType })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('rate_limit_exceeded') || errMsg.includes('429')) {
      const retryAfter = parseRetryAfter(errMsg)
      return res.status(429).json({ error: 'Ліміт запитів вичерпано', rateLimited: true, retryAfter })
    }
    console.error('Generate Error:', errMsg)
    return res.status(500).json({ error: 'Помилка генерації. Спробуйте ще раз.' })
  }
})

module.exports = router
