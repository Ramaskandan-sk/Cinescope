import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Trending = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('week')

  useEffect(() => {
    fetchTrendingMovies()
  }, [timeframe])

  const fetchTrendingMovies = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/movies/trending?timeframe=${timeframe}`)
      setMovies(res.data)
    } catch (error) {
      console.error('Error fetching trending movies:', error)
      // Fallback to regular movies
      const res = await axios.get('/api/movies')
      setMovies(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom section-padding">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          🔥 <span className="gradient-text">Trending Movies</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Discover what's hot in the movie world right now
        </p>

        {/* Timeframe Selector */}
        <div className="flex space-x-4">
          {[
            { key: 'day', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeframe(key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                timeframe === key
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Finding trending movies..." />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <div key={movie._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <MovieCard movie={movie} showTrendingBadge />
              </div>
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-white mb-2">No trending movies found</h3>
              <p className="text-gray-400">Check back later for trending content!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Trending