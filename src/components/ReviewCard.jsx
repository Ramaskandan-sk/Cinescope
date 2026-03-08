import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import LikeButton from './LikeButton'
import axios from 'axios'

const ReviewCard = ({ review, onUpdate }) => {
  const { user } = useContext(AuthContext)

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-500'
      case 'Negative': return 'bg-red-500'
      case 'Mixed': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/user/${review.userId?._id}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">
              {review.userId?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </Link>
          <div>
            <Link to={`/user/${review.userId?._id}`}>
              <p className="font-semibold text-white hover:text-primary-400 transition-colors cursor-pointer">
                {review.userId?.username || 'Anonymous'}
              </p>
            </Link>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'}>
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed">{review.text}</p>

      <div className="flex items-center justify-between pt-4 border-t border-dark-700">
        <div className="flex items-center space-x-3">
          {review.sentiment && (
            <span className={`${getSentimentColor(review.sentiment)} text-white text-xs px-3 py-1 rounded-full`}>
              {review.sentiment}
            </span>
          )}
          {review.spoilerFlag && (
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              ⚠️ Spoiler
            </span>
          )}
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
