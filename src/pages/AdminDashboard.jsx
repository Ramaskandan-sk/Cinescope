import { useState, useEffect } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
  const [movies, setMovies] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    poster: ''
  })

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const res = await axios.get('/api/movies')
      setMovies(res.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      genre: '',
      poster: ''
    })
    setEditingMovie(null)
    setShowForm(false)
  }

  const handleEdit = (movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      poster: movie.poster || ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingMovie) {
        // Update existing movie
        await axios.put(`/api/movies/${editingMovie._id}`, formData)
        alert('Movie updated successfully!')
      } else {
        // Create new movie
        await axios.post('/api/movies', formData)
        alert('Movie added successfully!')
      }
      resetForm()
      fetchMovies()
    } catch (error) {
      console.error('Error saving movie:', error)
      alert(error.response?.data?.message || 'Failed to save movie')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this movie?')) return
    try {
      await axios.delete(`/api/movies/${id}`)
      fetchMovies()
      alert('Movie deleted successfully!')
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert('Failed to delete movie')
    }
  }

  return (
    <div className="container-custom section-padding">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">
            🔐 <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="text-xl text-gray-400">Manage movies in the database</p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingMovie) {
              resetForm()
            } else {
              setShowForm(!showForm)
              setEditingMovie(null)
            }
          }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? '✕ Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showForm && (
        <div className="card p-8 mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold text-white mb-6">
            {editingMovie ? '✏️ Edit Movie' : '➕ Add New Movie'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="The Shawshank Redemption"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Year *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="input-field"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Crime">Crime</option>
                  <option value="Animation">Animation</option>
                  <option value="Documentary">Documentary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poster URL
                </label>
                <input
                  type="url"
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  className="input-field"
                  placeholder="https://image.tmdb.org/t/p/w500/..."
                />
              </div>
            </div>

            {formData.poster && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={formData.poster}
                    alt="Preview"
                    className="w-48 rounded-xl shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-48 h-72 bg-dark-700 rounded-xl items-center justify-center">
                    <span className="text-gray-500">Invalid image URL</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary flex-1">
                {editingMovie ? '💾 Update Movie' : '➕ Add Movie'}
              </button>
              {editingMovie && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-3xl font-bold text-white mb-6">
          🎬 All Movies ({movies.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Poster</th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Title</th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Year</th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Genre</th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Rating</th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Reviews</th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors">
                  <td className="py-4 px-4">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-dark-700 rounded flex items-center justify-center text-2xl">
                        🎬
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{movie.title}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{movie.year}</td>
                  <td className="py-4 px-4">
                    <span className="bg-dark-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {movie.genre}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-accent-400 font-semibold">
                      ⭐ {movie.avgRating?.toFixed(1) || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{movie.reviewCount || 0}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
