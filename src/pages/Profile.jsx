import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReviewCard from '../components/ReviewCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [posts, setPosts] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalPosts: 0,
    totalWatchlist: 0,
    totalFollowers: 0,
    totalFollowing: 0,
    avgRating: 0
  })

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  // Refresh data when returning to profile
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchUserData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  const fetchUserData = async () => {
    if (!user) {
      console.log('No user found, skipping data fetch')
      setLoading(false)
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setLoading(false)
        return
      }
      
      const headers = { Authorization: `Bearer ${token}` }
      
      // Get user ID - handle both id and _id
      const userId = user._id || user.id
      
      console.log('Fetching data for user:', userId, 'with token:', token.substring(0, 20) + '...')
      
      const [reviewsRes, watchlistRes, followersRes, followingRes, postsRes] = await Promise.all([
        axios.get('/api/reviews/user/me', { headers }).catch(err => {
          console.error('Error fetching reviews:', err.response?.data || err.message)
          return { data: [] }
        }),
        axios.get('/api/watchlist/me', { headers }).catch(err => {
          console.error('Error fetching watchlist:', err.response?.data || err.message)
          return { data: [] }
        }),
        axios.get(`/api/social/followers/${userId}`, { headers }).catch(err => {
          console.error('Error fetching followers:', err.response?.data || err.message)
          return { data: [] }
        }),
        axios.get(`/api/social/following/${userId}`, { headers }).catch(err => {
          console.error('Error fetching following:', err.response?.data || err.message)
          return { data: [] }
        }),
        axios.get(`/api/posts/user/me`, { headers }).catch(err => {
          console.error('Error fetching posts:', err.response?.data || err.message)
          return { data: [] }
        })
      ])
      
      console.log('Fetched data:', {
        reviews: reviewsRes.data.length,
        watchlist: watchlistRes.data.length,
        followers: followersRes.data.length,
        following: followingRes.data.length,
        posts: postsRes.data.length
      })
      
      setReviews(reviewsRes.data)
      setWatchlist(watchlistRes.data)
      setFollowers(followersRes.data)
      setFollowing(followingRes.data)
      setPosts(postsRes.data)
      
      // Calculate stats
      const avgRating = reviewsRes.data.length > 0
        ? (reviewsRes.data.reduce((sum, r) => sum + r.rating, 0) / reviewsRes.data.length).toFixed(1)
        : 0
      
      const newStats = {
        totalReviews: reviewsRes.data.length,
        totalPosts: postsRes.data.length,
        totalWatchlist: watchlistRes.data.length,
        totalFollowers: followersRes.data.length,
        totalFollowing: followingRes.data.length,
        avgRating
      }
      
      console.log('Setting stats:', newStats)
      setStats(newStats)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'reviews', label: 'Reviews', count: stats.totalReviews, icon: '⭐' },
    { id: 'posts', label: 'Posts', count: stats.totalPosts, icon: '💬' },
    { id: 'watchlist', label: 'Watchlist', count: stats.totalWatchlist, icon: '📚' },
    { id: 'activity', label: 'Activity', icon: '📊' }
  ]

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card p-8 mb-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20"></div>
        
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-5xl font-bold shadow-glow">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm">Change</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{user?.username}</h1>
                  <p className="text-gray-400 flex items-center justify-center md:justify-start space-x-2">
                    <span>📧</span>
                    <span>{user?.email}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center justify-center md:justify-start space-x-2">
                    <span>📅</span>
                    <span>Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link to="/settings" className="btn-ghost">
                    ⚙️ Edit Profile
                  </Link>
                  <button
                    onClick={fetchUserData}
                    disabled={loading}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors group"
                    title="Refresh profile data"
                  >
                    <svg 
                      className={`w-5 h-5 text-gray-400 group-hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="bg-dark-800/50 rounded-lg p-4 text-center hover:bg-dark-700/50 transition-colors">
                  <div className="text-2xl font-bold text-primary-500">{stats.totalReviews}</div>
                  <div className="text-xs text-gray-400 mt-1">Reviews</div>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-4 text-center hover:bg-dark-700/50 transition-colors">
                  <div className="text-2xl font-bold text-accent-500">{stats.totalPosts}</div>
                  <div className="text-xs text-gray-400 mt-1">Posts</div>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-4 text-center hover:bg-dark-700/50 transition-colors">
                  <div className="text-2xl font-bold text-blue-500">{stats.totalWatchlist}</div>
                  <div className="text-xs text-gray-400 mt-1">Watchlist</div>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-4 text-center hover:bg-dark-700/50 transition-colors cursor-pointer">
                  <div className="text-2xl font-bold text-green-500">{stats.totalFollowers}</div>
                  <div className="text-xs text-gray-400 mt-1">Followers</div>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-4 text-center hover:bg-dark-700/50 transition-colors cursor-pointer">
                  <div className="text-2xl font-bold text-purple-500">{stats.totalFollowing}</div>
                  <div className="text-xs text-gray-400 mt-1">Following</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-6 mt-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-gray-300">Avg Rating: <span className="font-bold text-white">{stats.avgRating}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500">🏆</span>
                  <span className="text-gray-300">Level: <span className="font-bold text-white">{Math.floor(stats.totalReviews / 5) + 1}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-white bg-dark-800'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'reviews' && (
          <>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
                <p className="text-gray-400 mb-6">Start reviewing movies to share your thoughts!</p>
                <Link to="/home" className="btn-primary">
                  Browse Movies
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'posts' && (
          <>
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post._id} className="card p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-300">{post.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
                <p className="text-gray-400 mb-6">Start discussions about your favorite movies!</p>
                <Link to="/home" className="btn-primary">
                  Start Discussion
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'watchlist' && (
          <>
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {watchlist.map((item) => (
                  <Link
                    key={item._id}
                    to={`/movie/${item.movieId?._id}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={item.movieId?.poster || '/placeholder.jpg'}
                        alt={item.movieId?.title}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 p-4">
                          <h3 className="font-bold text-white">{item.movieId?.title}</h3>
                          <p className="text-sm text-gray-300">{item.movieId?.year}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-white mb-2">Watchlist is empty</h3>
                <p className="text-gray-400 mb-6">Add movies you want to watch later!</p>
                <Link to="/home" className="btn-primary">
                  Discover Movies
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'activity' && (
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-dark-800 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div className="flex-1">
                  <p className="text-white">Reviewed <span className="text-primary-400 font-semibold">Inception</span></p>
                  <p className="text-sm text-gray-400">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-dark-800 rounded-lg">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <p className="text-white">Added <span className="text-primary-400 font-semibold">The Matrix</span> to watchlist</p>
                  <p className="text-sm text-gray-400">5 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-dark-800 rounded-lg">
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <p className="text-white">Started a discussion about <span className="text-primary-400 font-semibold">Sci-Fi Movies</span></p>
                  <p className="text-sm text-gray-400">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
