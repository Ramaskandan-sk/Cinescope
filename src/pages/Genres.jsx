import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Genres = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '')

  const genres = [
    { name: 'Action', icon: '💥', color: 'from-red-500 to-orange-500' },
    { name: 'Comedy', icon: '😂', color: 'from-yellow-400 to-orange-400' },
    { name: 'Drama', icon: '🎭', color: 'from-purple-500 to-pink-500' },
    { name: 'Horror', icon: '👻', color: 'from-gray-700 to-red-600' },
    { name: 'Sci-Fi', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
    { name: 'Thriller', icon: '🔪', color: 'from-gray-600 to-gray-800' },
    { name: 'Romance', icon: '💕', color: 'from-pink-400 to-red-400' },
    { name: 'Crime', icon: '🕵️', color: 'from-gray-800 to-black' },
    { name: 'Animation', icon: '🎨', color: 'from-green-400 to-blue-500' },
    { name: 'Documentary', icon: '📹', color: 'from-indigo-500 to-purple-600' }
  ]

  useEffect(() => {
    fetchMoviesByGenre()
  }, [selectedGenre])

  const fetchMoviesByGenre = async () => {
    try {
      setLoading(true)
      const url = selectedGenre 
        ? `/api/movies?genre=${selectedGenre}`
        : '/api/movies'
      const res = await axios.get(url)
      setMovies(res.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre)
    if (genre) {
      setSearchParams({ genre })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="container-custom section-padding">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          🎭 <span className="gradient-text">Browse by Genre</span>
        </h1>
        <p className="text-xl text-gray-400">
          Explore movies by your favorite genres
        </p>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        <button
          onClick={() => handleGenreSelect('')}
          className={`card p-6 text-center hover:scale-105 transition-all duration-300 ${
            !selectedGenre ? 'ring-2 ring-primary-500 bg-primary-600/20' : ''
          }`}
        >
          <div className="text-4xl mb-3">🎬</div>
          <div className="font-semibold text-white">All Movies</div>
        </button>
        
        {genres.map((genre) => (
          <button
            key={genre.name}
            onClick={() => handleGenreSelect(genre.name)}
            className={`card p-6 text-center hover:scale-105 transition-all duration-300 group ${
              selectedGenre === genre.name ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className={`text-4xl mb-3 p-3 rounded-xl bg-gradient-to-r ${genre.color} w-fit mx-auto group-hover:scale-110 transition-transform`}>
              {genre.icon}
            </div>
            <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
              {genre.name}
            </div>
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner size="lg" text={`Loading ${selectedGenre || 'all'} movies...`} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              {selectedGenre ? `${selectedGenre} Movies` : 'All Movies'}
              <span className="text-gray-400 text-lg ml-2">({movies.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <div key={movie._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No {selectedGenre?.toLowerCase()} movies found
              </h3>
              <p className="text-gray-400">Try selecting a different genre or check back later!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Genres