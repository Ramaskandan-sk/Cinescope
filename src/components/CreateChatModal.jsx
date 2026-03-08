import { useState } from 'react'
import axios from 'axios'

const CreateChatModal = ({ onClose, onChatCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Parse member IDs (comma-separated)
    const memberIds = formData.members
      .split(',')
      .map(id => id.trim())
      .filter(id => id)

    if (memberIds.length < 1) {
      setError('Please add at least one member ID')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/chats', {
        name: formData.name,
        description: formData.description,
        members: memberIds
      })
      onChatCreated(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create chat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-8 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create Group Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chat Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Movie Lovers"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-20"
              placeholder="A group for discussing movies..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Member IDs * (comma-separated)
            </label>
            <input
              type="text"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              className="input-field"
              placeholder="user_id_1, user_id_2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter user IDs separated by commas. You'll be added automatically.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateChatModal
