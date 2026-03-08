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

  const ratingOptions = [
    { value: '4.5', label: '4.5+', icon: '⭐⭐⭐⭐⭐' },
    { value: '4.0', label: '4.0+', icon: '⭐⭐⭐⭐' },
    { value: '3.5', label: '3.5+', icon: '⭐⭐⭐' },
    { value: '3.0', label: '3.0+', icon: '⭐⭐' }
  ]

  const sortOptions = [
    { value: 'popularity', label: 'Popularity', icon: '🔥' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' },
    { value: 'year', label: 'Release Year', icon: '📅' },
    { value: 'title', label: 'Title A-Z', icon: '🔤' }
  ]

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

  const hasActiveFilters = filters.genre || filters.year || filters.rating || filters.sortBy !== 'popularity'

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-20 left-0 h-[calc(100vh-5rem)] w-80
        bg-dark-800/95 backdrop-blur-md border-r border-dark-700/50 z-50
        transform transition-all duration-300 ease-out
        overflow-y-auto scrollbar-thin
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className={`sticky top-0 bg-dark-800/95 backdrop-blur-md border-b border-dark-700/50 p-6 z-10 transition-opacity duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl font-bold text-white">Filters</h3>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`p-6 space-y-6 transition-opacity duration-300`}>
          {/* Genre Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
              <span className="text-lg">🎭</span>
              <span>Genre</span>
            </label>
            <div className="relative">
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full appearance-none bg-dark-700/80 border border-dark-600 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer hover:bg-dark-700"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
              <span className="text-lg">📅</span>
              <span>Release Year</span>
            </label>
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full appearance-none bg-dark-700/80 border border-dark-600 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer hover:bg-dark-700"
              >
                <option value="">Any Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
              <span className="text-lg">⭐</span>
              <span>Minimum Rating</span>
            </label>
            <div className="space-y-2">
              {ratingOptions.map(option => (
                <label 
                  key={option.value} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    filters.rating === option.value
                      ? 'bg-primary-600 border-2 border-primary-500 shadow-glow'
                      : 'bg-dark-700/50 border-2 border-dark-600 hover:bg-dark-700 hover:border-dark-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="rating"
                      value={option.value}
                      checked={filters.rating === option.value}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
                    />
                    <span className={`font-medium ${
                      filters.rating === option.value ? 'text-white' : 'text-gray-300'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <span className="text-sm">{option.icon}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
              <span className="text-lg">🔄</span>
              <span>Sort By</span>
            </label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full appearance-none bg-dark-700/80 border border-dark-600 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer hover:bg-dark-700"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-dark-700 hover:bg-red-600/20 border-2 border-dark-600 hover:border-red-500 text-gray-300 hover:text-red-400 rounded-xl font-medium transition-all duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear All Filters</span>
            </button>
          )}

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="p-4 bg-dark-700/50 rounded-xl border border-dark-600">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {filters.genre && (
                  <span className="px-3 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full border border-primary-500/30">
                    {filters.genre}
                  </span>
                )}
                {filters.year && (
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                    {filters.year}
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                    {filters.rating}+ ⭐
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FilterSidebar