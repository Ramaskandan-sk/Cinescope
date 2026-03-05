import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext)
  const [votes, setVotes] = useState(post.votes || 0)
  const [voted, setVoted] = useState(0)

  const handleVote = async (value) => {
    if (!user) return
    try {
      await axios.post(`/api/posts/${post._id}/vote`, { value })
      setVotes(votes + value - voted)
      setVoted(value)
    } catch (error) {
      console.error('Error voting:', error)
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

  return (
    <div className="card p-6 hover:border-primary-500 transition">
      <div className="flex space-x-4">
        {user && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => handleVote(1)}
              className={`${voted === 1 ? 'text-primary-500' : 'text-gray-400'} hover:text-primary-500 transition`}
            >
              ▲
            </button>
            <span className="font-bold text-white">{votes}</span>
            <button
              onClick={() => handleVote(-1)}
              className={`${voted === -1 ? 'text-primary-500' : 'text-gray-400'} hover:text-primary-500 transition`}
            >
              ▼
            </button>
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            {post.tags?.map((tag, i) => (
              <span key={i} className={`${getTagColor(tag)} text-white text-xs px-2 py-1 rounded`}>
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="text-xl font-bold text-white hover:text-primary-500 cursor-pointer">
            {post.title}
          </h3>
          
          <p className="text-gray-300 line-clamp-3">{post.body}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>by {post.userId?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
