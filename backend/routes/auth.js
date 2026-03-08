import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ username, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    createdAt: req.user.createdAt
  })
})

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, email } = req.body
    
    // Check if username or email already exists (excluding current user)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: req.user._id }
    })
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' })
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true }
    ).select('-password')
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    const user = await User.findById(req.user._id)
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }
    
    user.password = newPassword
    await user.save()
    
    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete account
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user by ID (public profile)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
