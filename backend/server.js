import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import movieRoutes from './routes/movies.js'
import reviewRoutes from './routes/reviews.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import watchlistRoutes from './routes/watchlist.js'

dotenv.config()

const app = express()

connectDB()

app.use(helmet())
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/watchlist', watchlistRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CineScope API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
