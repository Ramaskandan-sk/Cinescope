import { Link } from 'react-router-dom'

const MovieCard = ({ movie, showTrendingBadge = false }) => {
  return (
    <Link to={`/movie/${movie._id}`} className="group block">
      <div className="card card-hover overflow-hidden">
        <div className="relative aspect-[2/3] bg-dark-700">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <span className="text-6xl">🎬</span>
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-sm">
            ⭐ {movie.avgRating?.toFixed(1) || 'N/A'}
          </div>
          
          {/* Trending Badge */}
          {showTrendingBadge && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs">
              🔥 TRENDING
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{movie.year}</span>
            <span className="bg-dark-700 text-gray-300 px-2 py-1 rounded text-xs">
              {movie.genre}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{movie.reviewCount || 0} reviews</span>
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{Math.floor(Math.random() * 1000) + 100}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
