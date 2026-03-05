import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../components/MovieCard'

const Watchlist = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('/api/watchlist/me')
      setMovies(res.data)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
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
      <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((item) => (
            <MovieCard key={item._id} movie={item.movieId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">Your watchlist is empty</p>
          <p className="text-gray-500">Start adding movies you want to watch!</p>
        </div>
      )}
    </div>
  )
}

export default Watchlist
