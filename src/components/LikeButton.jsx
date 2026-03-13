import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const LikeButton = ({ targetId, targetType, contentId, contentType, initialCount = 0, initialLikes = 0 }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [count, setCount] = useState(initialCount || initialLikes)
  const [loading, setLoading] = useState(false)

  // Use either targetId/targetType or contentId/contentType for backwards compatibility
  const finalTargetId = targetId || contentId
  const finalTargetType = targetType || contentType

  useEffect(() => {
    if (user && finalTargetId) {
      checkLikeStatus()
      fetchLikeCount()
    }
  }, [user, finalTargetId])

  const checkLikeStatus = async () => {
    try {
      const res = await axios.get(`/api/social/is-liked/${finalTargetType}/${finalTargetId}`)
      setIsLiked(res.data.isLiked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const fetchLikeCount = async () => {
    try {
      const res = await axios.get(`/api/social/likes/${finalTargetType}/${finalTargetId}`)
      setCount(res.data.count)
    } catch (error) {
      console.error('Error fetching like count:', error)
    }
  }

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      navigate('/login')
      return
    }

    if (loading) return

    setLoading(true)
    try {
      const res = await axios.post('/api/social/like', {
        targetId: finalTargetId,
        targetType: finalTargetType
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
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
        isLiked
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
          : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600 hover:text-white border border-dark-600 hover:border-dark-500'
      }`}
    >
      <svg 
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isLiked ? 'scale-110' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isLiked ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="font-semibold">{count}</span>
    </button>
  )
}

export default LikeButton
