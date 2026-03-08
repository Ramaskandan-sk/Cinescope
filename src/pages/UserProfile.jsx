import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import FollowButton from '../components/FollowButton'
import LoadingSpinner from '../components/LoadingSpinner'

const UserProfile = () => {
  const { id } = useParams()
  const { user: currentUser } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => {
    fetchUserData()
  }, [id])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [userRes, followersRes, followingRes, reviewsRes] = await Promise.all([
        axios.get(`/api/auth/user/${id}`),
        axios.get(`/api/social/followers/${id}`),
        axios.get(`/api/social/following/${id}`),
        axios.get(`/api/reviews/user/${id}`)
      ])
      
      setUser(userRes.data)
      setFollowers(followersRes.data)
      setFollowing(followingRes.data)
      setReviews(reviewsRes.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container-custom section-padding text-center">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-3xl font-bold text-white mb-4">User Not Found</h2>
        <Link to="/home" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  const isOwnProfile = currentUser?._id === id

  return (
    <div className="container-custom section-padding">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-6xl font-bold">
            {user.username?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
                {user.username}
              </h1>
              {!isOwnProfile && (
                <FollowButton userId={id} username={user.username} />
              )}
            </div>

            <p className="text-gray-400 mb-6">{user.email}</p>

            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-400">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {followers.length}
                </div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {following.length}
                </div>
                <div className="text-sm text-gray-400">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-dark-700">
        {['reviews', 'followers', 'following'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-4 font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="card p-6">
                  <Link
                    to={`/movie/${review.movieId?._id}`}
                    className="text-xl font-bold text-white hover:text-primary-400 transition"
                  >
                    {review.movieId?.title || 'Unknown Movie'}
                  </Link>
                  <div className="flex items-center space-x-2 my-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-accent-400' : 'text-gray-600'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300">{review.text}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400">No reviews yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followers.length > 0 ? (
              followers.map((follower) => (
                <Link
                  key={follower._id}
                  to={`/user/${follower._id}`}
                  className="card p-6 flex items-center space-x-4 hover:border-primary-500/50 transition"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                    {follower.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white">{follower.username}</div>
                    <div className="text-sm text-gray-400">View Profile</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-400">No followers yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {following.length > 0 ? (
              following.map((user) => (
                <Link
                  key={user._id}
                  to={`/user/${user._id}`}
                  className="card p-6 flex items-center space-x-4 hover:border-primary-500/50 transition"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.username}</div>
                    <div className="text-sm text-gray-400">View Profile</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-400">Not following anyone yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
