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
    const { tables } = req.body
    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({ error: 'Таблиці не передані' })
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

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze:\n${JSON.stringify(tables, null, 2)}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return res.status(500).json({ error: 'Порожня відповідь від AI' })

    let parsed
    try { parsed = JSON.parse(content) } catch {
      return res.status(500).json({ error: 'AI повернув некоректний формат' })
    }

    return res.json(parsed)
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('rate_limit_exceeded') || errMsg.includes('429')) {
      const retryAfter = parseRetryAfter(errMsg)
      return res.status(429).json({ error: 'Ліміт запитів вичерпано', rateLimited: true, retryAfter })
    }
    console.error('Normalize Error:', errMsg)
    return res.status(500).json({ error: 'Помилка аналізу. Спробуйте ще раз.' })
  }
})

module.exports = router
