const express = require('express')
const Groq = require('groq-sdk')

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

function parseRetryAfter(errorMessage) {
  const match = errorMessage.match(/Please try again in (\d+)m([\d.]+)s/)
  if (match) return parseInt(match[1]) * 60 + parseFloat(match[2])
  const secMatch = errorMessage.match(/Please try again in ([\d.]+)s/)
  if (secMatch) return parseFloat(secMatch[1])
  return null
}

router.post('/', async (req, res) => {
  try {
    const { currentSchema, userMessage, dbType = 'MySQL' } = req.body
    if (!currentSchema || !userMessage) {
      return res.status(400).json({ error: 'Відсутня схема або повідомлення' })
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

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Current schema:\n${JSON.stringify(currentSchema, null, 2)}\n\nRequest: ${userMessage.trim()}` },
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
      return res.status(500).json({ error: 'Неповна відповідь. Спробуйте ще раз.' })
    }

    return res.json({ ...parsed, dbType })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('rate_limit_exceeded') || errMsg.includes('429')) {
      const retryAfter = parseRetryAfter(errMsg)
      return res.status(429).json({ error: 'Ліміт запитів вичерпано', rateLimited: true, retryAfter })
    }
    console.error('Refine Error:', errMsg)
    return res.status(500).json({ error: 'Помилка уточнення. Спробуйте ще раз.' })
  }
})

module.exports = router
