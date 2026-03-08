import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const FollowButton = ({ userId, username }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && userId) {
      checkFollowStatus()
    }
  }, [user, userId])

  const checkFollowStatus = async () => {
    try {
      const res = await axios.get(`/api/social/is-following/${userId}`)
      setIsFollowing(res.data.isFollowing)
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const handleFollow = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      if (isFollowing) {
        await axios.delete(`/api/social/follow/${userId}`)
        setIsFollowing(false)
      } else {
        await axios.post(`/api/social/follow/${userId}`)
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      alert(error.response?.data?.message || 'Failed to update follow status')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user._id === userId) {
    return null
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 ${
        isFollowing
          ? 'bg-dark-700 text-white hover:bg-dark-600 border border-dark-600'
          : 'bg-primary-600 text-white hover:bg-primary-700 shadow-glow'
      }`}
    >
      {loading ? '...' : isFollowing ? '✓ Following' : '+ Follow'}
    </button>
  )
}

export default FollowButton
