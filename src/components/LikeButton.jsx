import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const LikeButton = ({ targetId, targetType, initialCount = 0 }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && targetId) {
      checkLikeStatus()
      fetchLikeCount()
    }
  }, [user, targetId])

  const checkLikeStatus = async () => {
    try {
      const res = await axios.get(`/api/social/is-liked/${targetType}/${targetId}`)
      setIsLiked(res.data.isLiked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const fetchLikeCount = async () => {
    try {
      const res = await axios.get(`/api/social/likes/${targetType}/${targetId}`)
      setCount(res.data.count)
    } catch (error) {
      console.error('Error fetching like count:', error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/social/like', {
        targetId,
        targetType
      })
      
      setIsLiked(res.data.liked)
      setCount(prev => res.data.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isLiked
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
      }`}
    >
      <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  )
}

export default LikeButton
