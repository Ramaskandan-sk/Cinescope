import { useState } from 'react'
import axios from 'axios'

const CreatePostForm = ({ movieId, onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const availableTags = [
    { value: 'review', label: 'Review', icon: '⭐' },
    { value: 'question', label: 'Question', icon: '❓' },
    { value: 'theory', label: 'Theory', icon: '💡' },
    { value: 'news', label: 'News', icon: '📰' }
  ]

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.tags.length === 0) {
      setError('Please select at least one tag')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/posts', {
        movieId,
        title: formData.title,
        body: formData.body,
        tags: formData.tags
      })
      
      setFormData({ title: '', body: '', tags: [] })
      onPostCreated()
    } catch (error) {
      console.error('Error creating post:', error)
      setError(error.response?.data?.message || 'Failed to create discussion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 animate-slide-up">
      <h3 className="text-2xl font-bold text-white mb-6">💬 Start a Discussion</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Discussion Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            placeholder="What's on your mind about this movie?"
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags *
          </label>
          <div className="flex flex-wrap gap-3">
            {availableTags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleTagToggle(tag.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  formData.tags.includes(tag.value)
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                <span className="mr-2">{tag.icon}</span>
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Thoughts *
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="input-field min-h-32"
            placeholder="Share your thoughts, theories, or questions about this movie..."
            required
            maxLength={2000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.body.length}/2000 characters
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Posting...' : '📤 Post Discussion'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostForm
