import express from 'express'
import crypto from 'crypto'
import User from '../models/User.js'
import PasswordReset from '../models/PasswordReset.js'

const router = express.Router()

// Request password reset
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If email exists, reset link will be sent' })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour

    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt
    })

    // In production, send email here
    // For now, return token (remove in production!)
    console.log(`Password reset token for ${email}: ${token}`)
    console.log(`Reset link: http://localhost:3000/reset-password/${token}`)

    res.json({
      message: 'Password reset link sent to email',
      // Remove this in production!
      devToken: token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Verify reset token
router.get('/verify/:token', async (req, res) => {
  try {
    const resetRequest = await PasswordReset.findOne({
      token: req.params.token,
      used: false,
      expiresAt: { $gt: new Date() }
    })

    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    res.json({ valid: true })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    const resetRequest = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    })

    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    const user = await User.findById(resetRequest.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update password
    user.password = newPassword
    await user.save()

    // Mark token as used
    resetRequest.used = true
    await resetRequest.save()

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
