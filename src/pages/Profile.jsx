import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import ReviewCard from '../components/ReviewCard'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserReviews()
  }, [])

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/user/me')
      setReviews(res.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.username}</h1>
            <p className="text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-dark-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">{reviews.length}</div>
            <div className="text-gray-400">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">0</div>
            <div className="text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">0</div>
            <div className="text-gray-400">Watchlist</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">My Reviews</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">You haven't written any reviews yet</p>
        </div>
      )}
    </div>
  )
}

export default Profile
