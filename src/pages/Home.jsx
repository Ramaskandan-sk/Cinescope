import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../components/MovieCard'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [movies, setMovies] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('movies')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchData()
  }, [activeTab, searchQuery, filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'movies') {
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (filters.genre) params.append('genre', filters.genre)
        if (filters.year) params.append('year', filters.year)
        if (filters.rating) params.append('minRating', filters.rating)
        if (filters.sortBy) params.append('sortBy', filters.sortBy)
        
        const moviesRes = await axios.get(`/api/movies?${params}`)
        setMovies(moviesRes.data)
      } else {
        const postsRes = await axios.get('/api/posts')
        setPosts(postsRes.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const tabs = [
    { key: 'movies', label: 'Movies', icon: '🎬' },
    { key: 'discussions', label: 'Discussions', icon: '💬' },
  ]

  return (
    <div className="flex">
      {/* Filter Sidebar */}
      {activeTab === 'movies' && (
        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 container-custom section-padding">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                🎬 <span className="gradient-text">Discover Movies</span>
              </h1>
              <p className="text-xl text-gray-400">
                Explore, review, and discuss the world of cinema
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={handleSearch} />
              {activeTab === 'movies' && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary"
                >
                  🔍 Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-dark-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 pb-4 px-2 font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading content..." />
        ) : (
          <>
            {activeTab === 'movies' ? (
              <>
                {/* Movies Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {movies.map((movie, index) => (
                    <div key={movie._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                {movies.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
                    <p className="text-gray-400">
                      {searchQuery ? 'Try adjusting your search or filters' : 'Check back later for new content!'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Discussions */}
                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <div key={post._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>

                {posts.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No discussions yet</h3>
                    <p className="text-gray-400">Be the first to start a conversation!</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
