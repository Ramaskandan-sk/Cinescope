import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    enum: ['review', 'question', 'theory', 'news']
  }],
  votes: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model('Post', postSchema)
