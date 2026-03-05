import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import ReviewCard from '../components/ReviewCard'
import PostCard from '../components/PostCard'
import CreatePostForm from '../components/CreatePostForm'
import VotingGuide from '../components/VotingGuide'
import LoadingSpinner from '../components/LoadingSpinner'

const MovieDetail = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')
  const [inWatchlist, setInWatchlist] = useState(false)
  const [showVotingGuide, setShowVotingGuide] = useState(false)
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  useEffect(() => {
    fetchMovieData()
    if (user) {
      checkWatchlistStatus()
    }
  }, [id, user])

  const checkWatchlistStatus = async () => {
    try {
      const res = await axios.get('/api/watchlist/me')
      const isInWatchlist = res.data.some(item => item.movieId?._id === id)
      setInWatchlist(isInWatchlist)
    } catch (error) {
      console.error('Error checking watchlist:', error)
    }
  }

  const fetchMovieData = async () => {
    try {
      setLoading(true)
      const [movieRes, reviewsRes, postsRes] = await Promise.all([
        axios.get(`/api/movies/${id}`),
        axios.get(`/api/reviews/movie/${id}`),
        axios.get(`/api/posts/movie/${id}`)
      ])
      setMovie(movieRes.data)
      setReviews(reviewsRes.data)
      setPosts(postsRes.data)
    } catch (error) {
      console.error('Error fetching movie data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert('Please login to add movies to your watchlist')
      return
    }
    
    try {
      if (inWatchlist) {
        await axios.delete(`/api/watchlist/${id}`)
        alert('Removed from watchlist!')
      } else {
        await axios.post(`/api/watchlist/${id}`)
        alert('Added to watchlist!')
      }
      setInWatchlist(!inWatchlist)
    } catch (error) {
      console.error('Error updating watchlist:', error)
      alert(error.response?.data?.message || 'Failed to update watchlist')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/reviews', {
        movieId: id,
        rating,
        text: reviewText
      })
      setShowReviewForm(false)
      setReviewText('')
      setRating(5)
      fetchMovieData()
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error.response?.data?.message || 'Failed to submit review')
    }
  }

  const handlePostCreated = () => {
    setShowPostForm(false)
    fetchMovieData()
    setActiveTab('discussions')
    alert('Discussion posted successfully!')
  }

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <LoadingSpinner size="lg" text="Loading movie details..." />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container-custom section-padding text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-3xl font-bold text-white mb-4">Movie Not Found</h2>
        <Link to="/home" className="btn-primary">
          Browse Movies
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom section-padding">
      {/* Movie Header */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="card card-hover overflow-hidden">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-full" />
            ) : (
              <div className="aspect-[2/3] bg-dark-700 flex items-center justify-center">
                <span className="text-9xl">🎬</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-xl text-gray-400">
              <span>📅 {movie.year}</span>
              <span>•</span>
              <span>🎭 {movie.genre}</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-5xl font-bold gradient-text">
                {movie.avgRating?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-gray-400 mt-2">⭐ Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white">
                {movie.reviewCount || 0}
              </div>
              <div className="text-sm text-gray-400 mt-2">📝 Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white">
                {posts.length}
              </div>
              <div className="text-sm text-gray-400 mt-2">💬 Discussions</div>
            </div>
          </div>

          {user ? (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToWatchlist}
                className={`${inWatchlist ? 'btn-secondary' : 'btn-primary'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(!showReviewForm)
                  setShowPostForm(false)
                }}
                className="btn-secondary"
              >
                ⭐ Write Review
              </button>
              <button
                onClick={() => {
                  setShowPostForm(!showPostForm)
                  setShowReviewForm(false)
                }}
                className="btn-secondary"
              >
                💬 Start Discussion
              </button>
            </div>
          ) : (
            <div className="card p-6">
              <p className="text-gray-400 mb-4">
                Login to write reviews, start discussions, and add to your watchlist
              </p>
              <Link to="/login" className="btn-primary">
                Login / Sign Up
              </Link>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="card p-6 space-y-4 animate-slide-up">
              <h3 className="text-2xl font-bold text-white">⭐ Write Your Review</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-4xl transition-transform hover:scale-110"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="input-field min-h-32"
                  placeholder="Share your thoughts about this movie..."
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Post Form */}
          {showPostForm && (
            <CreatePostForm
              movieId={id}
              onPostCreated={handlePostCreated}
              onCancel={() => setShowPostForm(false)}
            />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-8 border-b border-dark-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-4 font-semibold transition-all duration-200 ${
              activeTab === 'reviews'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⭐ Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`pb-4 px-4 font-semibold transition-all duration-200 ${
              activeTab === 'discussions'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Discussions ({posts.length})
          </button>
        </div>

        {activeTab === 'discussions' && (
          <button
            onClick={() => setShowVotingGuide(!showVotingGuide)}
            className="text-sm text-gray-400 hover:text-primary-400 transition-colors pb-4"
          >
            {showVotingGuide ? '✕ Hide' : '💡 How Voting Works'}
          </button>
        )}
      </div>

      {/* Voting Guide */}
      {activeTab === 'discussions' && showVotingGuide && (
        <VotingGuide />
      )}

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'reviews' ? (
          reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ReviewCard review={review} onUpdate={fetchMovieData} />
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-white mb-2">No reviews yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share your thoughts!</p>
              {user && (
                <button onClick={() => setShowReviewForm(true)} className="btn-primary">
                  Write First Review
                </button>
              )}
            </div>
          )
        ) : (
          posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={post._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-white mb-2">No discussions yet</h3>
              <p className="text-gray-400 mb-6">Start the conversation about this movie!</p>
              {user && (
                <button onClick={() => setShowPostForm(true)} className="btn-primary">
                  Start First Discussion
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default MovieDetail
