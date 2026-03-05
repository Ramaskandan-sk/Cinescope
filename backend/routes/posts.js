import express from 'express'
import Post from '../models/Post.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async (req, res) => {
  try {
    const { movieId, title, body, tags } = req.body
    const post = await Post.create({
      userId: req.user._id,
      movieId,
      title,
      body,
      tags
    })
    const populatedPost = await Post.findById(post._id).populate('userId', 'username')
    res.status(201).json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username')
      .populate('movieId', 'title')
      .sort({ createdAt: -1 })
      .limit(20)
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/movie/:movieId', async (req, res) => {
  try {
    const posts = await Post.find({ movieId: req.params.movieId })
      .populate('userId', 'username')
      .sort({ votes: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { value } = req.body
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: value } },
      { new: true }
    )
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
