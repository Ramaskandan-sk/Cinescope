import { useState } from 'react'

const SearchBar = ({ onSearch, placeholder = "Search movies..." }) => {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-96' : 'w-64'}`}>
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            placeholder={placeholder}
            className="w-full bg-dark-700/50 backdrop-blur-sm border border-dark-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
        
        {query && (
          <button
            type="submit"
            className="ml-2 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl transition-colors duration-200"
          >
            Search
          </button>
        )}
      </div>
      
      {/* Search Suggestions */}
      {isExpanded && query && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-white/10 p-4 z-50">
          <div className="text-sm text-gray-400 mb-2">Quick suggestions:</div>
          <div className="space-y-2">
            {['Action Movies', 'Comedy Films', 'Sci-Fi Classics', 'Recent Releases'].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion)
                  onSearch(suggestion)
                }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}

export default SearchBar