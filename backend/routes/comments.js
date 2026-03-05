import express from 'express'
import Comment from '../models/Comment.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async (req, res) => {
  try {
    const { parentId, parentType, text } = req.body
    const comment = await Comment.create({
      userId: req.user._id,
      parentId,
      parentType,
      text
    })
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username')
    res.status(201).json(populatedComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:parentId', async (req, res) => {
  try {
    const comments = await Comment.find({ parentId: req.params.parentId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
