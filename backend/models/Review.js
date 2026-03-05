import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Mixed'],
    default: 'Mixed'
  },
  spoilerFlag: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model('Review', reviewSchema)
