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
    const { tables, dbType = 'MySQL' } = req.body
    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({ error: 'Таблиці не передані' })
    }

    const systemPrompt = `You are a database expert. Generate realistic test INSERT data.
Return ONLY valid JSON — no text, no markdown.

Format:
{ "seed_sql": "-- Test data\\nINSERT INTO table1 ...;\\nINSERT INTO table2 ...;" }

Rules:
- 5 realistic rows per table
- Use proper SQL syntax for ${dbType}
- Respect foreign key order — parent tables first
- Use realistic Ukrainian names and data
- ONLY JSON`

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate INSERT data for:\n${JSON.stringify(tables, null, 2)}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return res.status(500).json({ error: 'Порожня відповідь від AI' })

    let parsed
    try { parsed = JSON.parse(content) } catch {
      return res.status(500).json({ error: 'AI повернув некоректний формат' })
    }

    if (!parsed.seed_sql) {
      return res.status(500).json({ error: 'AI не згенерував дані. Спробуйте ще раз.' })
    }

    return res.json(parsed)
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('rate_limit_exceeded') || errMsg.includes('429')) {
      const retryAfter = parseRetryAfter(errMsg)
      return res.status(429).json({ error: 'Ліміт запитів вичерпано', rateLimited: true, retryAfter })
    }
    console.error('Seed Error:', errMsg)
    return res.status(500).json({ error: 'Помилка генерації даних. Спробуйте ще раз.' })
  }
})

module.exports = router
