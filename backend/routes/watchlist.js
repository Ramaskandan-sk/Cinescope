import express from 'express'
import Watchlist from '../models/Watchlist.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/:movieId', protect, async (req, res) => {
  try {
    const watchlistItem = await Watchlist.create({
      userId: req.user._id,
      movieId: req.params.movieId
    })
    res.status(201).json(watchlistItem)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already in watchlist' })
    }
    res.status(500).json({ message: error.message })
  }
})

router.get('/me', protect, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id })
      .populate('movieId')
      .sort({ createdAt: -1 })
    res.json(watchlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:movieId', protect, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({
      userId: req.user._id,
      movieId: req.params.movieId
    })
    res.json({ message: 'Removed from watchlist' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
