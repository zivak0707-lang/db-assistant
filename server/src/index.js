require('dotenv').config()
const express = require('express')
const cors = require('cors')

const generateRouter = require('./routes/generate')
const normalizeRouter = require('./routes/normalize')
const refineRouter = require('./routes/refine')
const seedRouter = require('./routes/seed')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}))
app.use(express.json())

app.use('/api/generate', generateRouter)
app.use('/api/normalize', normalizeRouter)
app.use('/api/refine', refineRouter)
app.use('/api/seed', seedRouter)

app.get('/', (req, res) => res.json({ status: 'ok', message: 'DB Assistant API running' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})