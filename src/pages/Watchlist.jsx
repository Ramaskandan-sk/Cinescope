import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get('/api/watchlist/me')
      console.log('Watchlist response:', res.data)
      setWatchlistItems(res.data)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      setError(error.response?.data?.message || 'Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await axios.delete(`/api/watchlist/${movieId}`)
      setWatchlistItems(watchlistItems.filter(item => item.movieId?._id !== movieId))
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <LoadingSpinner size="lg" text="Loading your watchlist..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom section-padding">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-2">Error Loading Watchlist</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={fetchWatchlist} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom section-padding">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          📚 <span className="gradient-text">My Watchlist</span>
        </h1>
        <p className="text-xl text-gray-400">
          {watchlistItems.length} {watchlistItems.length === 1 ? 'movie' : 'movies'} saved
        </p>
      </div>

      {watchlistItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlistItems.map((item, index) => (
            <div key={item._id} className="relative group animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              {item.movieId ? (
                <>
                  <MovieCard movie={item.movieId} />
                  <button
                    onClick={() => handleRemoveFromWatchlist(item.movieId._id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    title="Remove from watchlist"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="card p-4 text-center text-gray-400">
                  Movie not found
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">📽️</div>
          <h3 className="text-3xl font-bold text-white mb-4">Your watchlist is empty</h3>
          <p className="text-gray-400 text-lg mb-8">Start adding movies you want to watch!</p>
          <a href="/home" className="btn-primary">
            Browse Movies
          </a>
        </div>
      )}
    </div>
  )
}

export default Watchlist
