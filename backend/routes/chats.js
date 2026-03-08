import express from 'express'
import Chat from '../models/Chat.js'
import Message from '../models/Message.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Create group chat
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, members } = req.body

    if (!members || members.length < 2) {
      return res.status(400).json({ message: 'Group chat needs at least 2 members' })
    }

    // Add creator to members if not included
    const allMembers = [...new Set([req.user._id.toString(), ...members])]

    const chat = await Chat.create({
      name,
      description,
      type: 'group',
      members: allMembers,
      admins: [req.user._id],
      createdBy: req.user._id
    })

    // Create system message
    await Message.create({
      chatId: chat._id,
      sender: req.user._id,
      content: `${req.user.username} created the group`,
      type: 'system'
    })

    const populatedChat = await Chat.findById(chat._id)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username')

    res.status(201).json(populatedChat)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user chats
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate('members', 'username avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })

    res.json(chats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get chat by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      members: req.user._id
    })
      .populate('members', 'username avatar')
      .populate('admins', 'username')

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    res.json(chat)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Send message
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { content, type = 'text' } = req.body

    const chat = await Chat.findOne({
      _id: req.params.id,
      members: req.user._id
    })

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const message = await Message.create({
      chatId: chat._id,
      sender: req.user._id,
      content,
      type,
      readBy: [req.user._id]
    })

    // Update chat's last message
    chat.lastMessage = message._id
    chat.updatedAt = new Date()
    await chat.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar')

    res.status(201).json(populatedMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get chat messages
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query

    const chat = await Chat.findOne({
      _id: req.params.id,
      members: req.user._id
    })

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const messages = await Message.find({ chatId: chat._id })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.json(messages.reverse())
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add members to group
router.post('/:id/members', protect, async (req, res) => {
  try {
    const { members } = req.body

    const chat = await Chat.findOne({
      _id: req.params.id,
      admins: req.user._id
    })

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or not authorized' })
    }

    chat.members = [...new Set([...chat.members.map(m => m.toString()), ...members])]
    await chat.save()

    // Create system message
    await Message.create({
      chatId: chat._id,
      sender: req.user._id,
      content: `${req.user.username} added new members`,
      type: 'system'
    })

    const updatedChat = await Chat.findById(chat._id)
      .populate('members', 'username avatar')

    res.json(updatedChat)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Leave chat
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      members: req.user._id
    })

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    chat.members = chat.members.filter(m => m.toString() !== req.user._id.toString())
    chat.admins = chat.admins.filter(a => a.toString() !== req.user._id.toString())
    
    await chat.save()

    // Create system message
    await Message.create({
      chatId: chat._id,
      sender: req.user._id,
      content: `${req.user.username} left the group`,
      type: 'system'
    })

    res.json({ message: 'Left chat successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark messages as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        chatId: req.params.id,
        readBy: { $ne: req.user._id }
      },
      {
        $addToSet: { readBy: req.user._id }
      }
    )

    res.json({ message: 'Messages marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
