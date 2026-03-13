import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import LikeButton from './LikeButton'
import axios from 'axios'

const ReviewCard = ({ review, onUpdate }) => {
  const { user } = useContext(AuthContext)

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-400'
    if (rating >= 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatDate = (date) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffTime = Math.abs(now - reviewDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return reviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 hover:border-dark-600 transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* User Info */}
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Link to={`/user/${review.userId?._id}`} className="flex-shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg ring-2 ring-dark-700 group-hover:ring-primary-500/50">
                {review.userId?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/user/${review.userId?._id}`}>
                <p className="font-semibold text-white hover:text-primary-400 transition-colors cursor-pointer truncate text-sm sm:text-base">
                  {review.userId?.username || 'Anonymous'}
                </p>
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-500">
                  {formatDate(review.createdAt)}
                </p>
                {review.spoilerFlag && (
                  <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Spoiler
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex-shrink-0">
            <div className="flex flex-col items-end gap-1">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-700/50 border border-dark-600 ${getRatingColor(review.rating)}`}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-sm sm:text-base">{review.rating}</span>
                <span className="text-gray-500 text-xs">/5</span>
              </div>
              {/* Star Display */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-700'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div className="mt-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {review.text}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 bg-dark-900/50 border-t border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden sm:inline">Review</span>
        </div>
        
        {user && (
          <LikeButton
            contentType="review"
            contentId={review._id}
            initialLikes={review.likes || 0}
          />
        )}
      </div>
    </div>
  )
}

export default ReviewCard
