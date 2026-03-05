import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext)
  const [votes, setVotes] = useState(post.votes || 0)
  const [voted, setVoted] = useState(0) // 0 = not voted, 1 = upvoted, -1 = downvoted

  const handleVote = async (value) => {
    if (!user) {
      alert('Please login to vote on discussions')
      return
    }

    try {
      // If clicking the same vote, remove it (toggle off)
      if (voted === value) {
        await axios.post(`/api/posts/${post._id}/vote`, { value: -value })
        setVotes(votes - value)
        setVoted(0)
      } else {
        // If switching vote or voting for first time
        const voteChange = value - voted
        await axios.post(`/api/posts/${post._id}/vote`, { value: voteChange })
        setVotes(votes + voteChange)
        setVoted(value)
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to vote. Please try again.')
    }
  }

  const getTagColor = (tag) => {
    const colors = {
      review: 'bg-blue-500',
      question: 'bg-purple-500',
      theory: 'bg-green-500',
      news: 'bg-yellow-500'
    }
    return colors[tag] || 'bg-gray-500'
  }

  const getTagIcon = (tag) => {
    const icons = {
      review: '⭐',
      question: '❓',
      theory: '💡',
      news: '📰'
    }
    return icons[tag] || '📌'
  }

  const getVoteColor = () => {
    if (votes > 0) return 'text-green-400'
    if (votes < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="card p-6 hover:border-primary-500/50 transition-all duration-300">
      <div className="flex space-x-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center space-y-2 min-w-[60px]">
          <button
            onClick={() => handleVote(1)}
            disabled={!user}
            className={`p-2 rounded-lg transition-all duration-200 ${
              voted === 1
                ? 'bg-green-500 text-white shadow-glow'
                : 'text-gray-400 hover:text-green-400 hover:bg-dark-700'
            } ${!user && 'opacity-50 cursor-not-allowed'}`}
            title={user ? 'Upvote' : 'Login to vote'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3l7 7h-4v7H7v-7H3l7-7z" />
            </svg>
          </button>

          <div className={`font-bold text-xl ${getVoteColor()}`}>
            {votes > 0 && '+'}
            {votes}
          </div>

          <button
            onClick={() => handleVote(-1)}
            disabled={!user}
            className={`p-2 rounded-lg transition-all duration-200 ${
              voted === -1
                ? 'bg-red-500 text-white shadow-glow'
                : 'text-gray-400 hover:text-red-400 hover:bg-dark-700'
            } ${!user && 'opacity-50 cursor-not-allowed'}`}
            title={user ? 'Downvote' : 'Login to vote'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 17l-7-7h4V3h6v7h4l-7 7z" />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-3">
          {/* Tags */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {post.tags?.map((tag, i) => (
              <span
                key={i}
                className={`${getTagColor(tag)} text-white text-xs px-3 py-1 rounded-full font-medium`}
              >
                {getTagIcon(tag)} {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
          </div>

          {/* Title */}
          <Link to={`/movie/${post.movieId?._id || post.movieId}`}>
            <h3 className="text-xl font-bold text-white hover:text-primary-400 cursor-pointer transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Body */}
          <p className="text-gray-300 leading-relaxed line-clamp-3">
            {post.body}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-dark-700">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
                  {post.userId?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium">
                  {post.userId?.username || 'Anonymous'}
                </span>
              </div>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {post.movieId?.title && (
                <>
                  <span>•</span>
                  <Link
                    to={`/movie/${post.movieId._id}`}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    🎬 {post.movieId.title}
                  </Link>
                </>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <span>💬</span>
                <span>0 comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Help Tooltip (for non-logged users) */}
      {!user && (
        <div className="mt-4 p-3 bg-dark-700/50 rounded-lg border border-dark-600">
          <p className="text-xs text-gray-400 text-center">
            💡 <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to upvote discussions you find interesting or downvote ones you disagree with
          </p>
        </div>
      )}
    </div>
  )
}

export default PostCard
