import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  parentType: {
    type: String,
    enum: ['post', 'review', 'comment'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model('Comment', commentSchema)
