import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['review', 'post', 'comment'],
    required: true
  }
}, { timestamps: true })

likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true })
likeSchema.index({ targetId: 1, targetType: 1 })

export default mongoose.model('Like', likeSchema)
