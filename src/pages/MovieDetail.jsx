import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import ReviewCard from '../components/ReviewCard'
import PostCard from '../components/PostCard'

const MovieDetail = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')
  const [inWatchlist, setInWatchlist] = useState(false)
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  useEffect(() => {
    fetchMovieData()
  }, [id])

  const fetchMovieData = async () => {
    try {
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
    try {
      if (inWatchlist) {
        await axios.delete(`/api/watchlist/${id}`)
      } else {
        await axios.post(`/api/watchlist/${id}`)
      }
      setInWatchlist(!inWatchlist)
    } catch (error) {
      console.error('Error updating watchlist:', error)
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
      fetchMovieData()
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="card overflow-hidden">
            {movie?.poster ? (
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
            <h1 className="text-4xl font-bold text-white mb-2">{movie?.title}</h1>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>{movie?.year}</span>
              <span>•</span>
              <span>{movie?.genre}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500">
                {movie?.avgRating?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-gray-400">⭐ Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {movie?.reviewCount || 0}
              </div>
              <div className="text-sm text-gray-400">Reviews</div>
            </div>
          </div>

          {user && (
            <div className="flex space-x-4">
              <button
                onClick={handleAddToWatchlist}
                className={`${inWatchlist ? 'btn-secondary' : 'btn-primary'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-secondary"
              >
                Write Review
              </button>
            </div>
          )}

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-3xl"
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
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 px-2 font-semibold transition ${
            activeTab === 'reviews'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('discussions')}
          className={`pb-4 px-2 font-semibold transition ${
            activeTab === 'discussions'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Discussions ({posts.length})
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'reviews' ? (
          reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} onUpdate={fetchMovieData} />
            ))
          ) : (
            <p className="text-center text-gray-400 py-12">No reviews yet. Be the first!</p>
          )
        ) : (
          posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-center text-gray-400 py-12">No discussions yet. Start one!</p>
          )
        )}
      </div>
    </div>
  )
}

export default MovieDetail
