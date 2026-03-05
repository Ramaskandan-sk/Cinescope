import { useState } from 'react'

const FilterSidebar = ({ onFilterChange, isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity'
  })

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 
    'Thriller', 'Romance', 'Crime', 'Animation', 'Documentary'
  ]

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      year: '',
      rating: '',
      sortBy: 'popularity'
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-20 left-0 h-screen lg:h-auto w-80 lg:w-64
        glass border-r border-white/10 p-6 z-50
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Filters</h3>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Release Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Any Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Minimum Rating
            </label>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map(rating => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating.toString()}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-gray-300">
                    {rating}+ ⭐
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="year">Release Year</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full btn-secondary text-sm"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar