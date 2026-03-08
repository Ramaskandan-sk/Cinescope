import express from 'express'
import Follow from '../models/Follow.js'
import Like from '../models/Like.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
import { createNotification } from './notifications.js'

const router = express.Router()

// Follow user
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' })
    }

    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: userId
    })

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' })
    }

    await Follow.create({
      follower: req.user._id,
      following: userId
    })

    // Create notification
    await createNotification(
      userId,
      'follow',
      'New Follower',
      `${req.user.username} started following you`,
      `/profile/${req.user._id}`,
      req.user._id
    )

    res.json({ message: 'Successfully followed user' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Unfollow user
router.delete('/follow/:userId', protect, async (req, res) => {
  try {
    const result = await Follow.findOneAndDelete({
      follower: req.user._id,
      following: req.params.userId
    })

    if (!result) {
      return res.status(404).json({ message: 'Not following this user' })
    }

    res.json({ message: 'Successfully unfollowed user' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get followers
router.get('/followers/:userId', async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username avatar')
      .sort({ createdAt: -1 })
    
    res.json(followers.map(f => f.follower))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get following
router.get('/following/:userId', async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate('following', 'username avatar')
      .sort({ createdAt: -1 })
    
    res.json(following.map(f => f.following))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Check if following
router.get('/is-following/:userId', protect, async (req, res) => {
  try {
    const isFollowing = await Follow.exists({
      follower: req.user._id,
      following: req.params.userId
    })
    
    res.json({ isFollowing: !!isFollowing })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Like content
router.post('/like', protect, async (req, res) => {
  try {
    const { targetId, targetType } = req.body

    const existingLike = await Like.findOne({
      userId: req.user._id,
      targetId,
      targetType
    })

    if (existingLike) {
      await existingLike.deleteOne()
      return res.json({ message: 'Like removed', liked: false })
    }

    await Like.create({
      userId: req.user._id,
      targetId,
      targetType
    })

    res.json({ message: 'Content liked', liked: true })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get likes count
router.get('/likes/:targetType/:targetId', async (req, res) => {
  try {
    const count = await Like.countDocuments({
      targetId: req.params.targetId,
      targetType: req.params.targetType
    })
    
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Check if liked
router.get('/is-liked/:targetType/:targetId', protect, async (req, res) => {
  try {
    const isLiked = await Like.exists({
      userId: req.user._id,
      targetId: req.params.targetId,
      targetType: req.params.targetType
    })
    
    res.json({ isLiked: !!isLiked })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
