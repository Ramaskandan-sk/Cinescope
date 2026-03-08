import express from 'express'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Get user notifications
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query
    
    const query = { userId: req.user._id }
    if (unreadOnly === 'true') {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .populate('fromUser', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    })

    res.json({
      notifications,
      unreadCount,
      page: parseInt(page),
      totalPages: Math.ceil(await Notification.countDocuments(query) / limit)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    )
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    
    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    )
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    })
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Helper function to create notification
export const createNotification = async (userId, type, title, message, link = '', fromUser = null, data = {}) => {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      fromUser,
      data
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

export default router
