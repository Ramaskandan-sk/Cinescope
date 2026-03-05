import express from 'express'
import Review from '../models/Review.js'
import Movie from '../models/Movie.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async (req, res) => {
  try {
    const { movieId, rating, text } = req.body

    const review = await Review.create({
      userId: req.user._id,
      movieId,
      rating,
      text,
      sentiment: analyzeSentiment(text),
      spoilerFlag: detectSpoiler(text)
    })

    await updateMovieRating(movieId)

    const populatedReview = await Review.findById(review._id).populate('userId', 'username')
    res.status(201).json(populatedReview)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/user/me', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('movieId', 'title poster')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )
    res.json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await review.deleteOne()
    await updateMovieRating(review.movieId)
    res.json({ message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

async function updateMovieRating(movieId) {
  const reviews = await Review.find({ movieId })
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0
  await Movie.findByIdAndUpdate(movieId, {
    avgRating,
    reviewCount: reviews.length
  })
}

function analyzeSentiment(text) {
  const positive = ['great', 'amazing', 'excellent', 'love', 'best', 'wonderful', 'fantastic']
  const negative = ['bad', 'terrible', 'worst', 'hate', 'awful', 'boring', 'disappointing']
  
  const lowerText = text.toLowerCase()
  const posCount = positive.filter(word => lowerText.includes(word)).length
  const negCount = negative.filter(word => lowerText.includes(word)).length
  
  if (posCount > negCount) return 'Positive'
  if (negCount > posCount) return 'Negative'
  return 'Mixed'
}

function detectSpoiler(text) {
  const spoilerWords = ['spoiler', 'ending', 'dies', 'killed', 'twist', 'reveal']
  return spoilerWords.some(word => text.toLowerCase().includes(word))
}

export default router
