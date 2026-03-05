import { useState, useEffect } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
  const [movies, setMovies] = useState([])
  const [showForm, setShowForm] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/movies', formData)
      setFormData({ title: '', year: new Date().getFullYear(), genre: '', poster: '' })
      setShowForm(false)
      fetchMovies()
      alert('Movie added successfully!')
    } catch (error) {
      console.error('Error adding movie:', error)
      alert('Failed to add movie')
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage movies in the database</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showForm && (
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Movie</h2>
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
                <img
                  src={formData.poster}
                  alt="Preview"
                  className="w-48 rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Add Movie
            </button>
          </form>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          All Movies ({movies.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-gray-300">Poster</th>
                <th className="text-left py-3 px-4 text-gray-300">Title</th>
                <th className="text-left py-3 px-4 text-gray-300">Year</th>
                <th className="text-left py-3 px-4 text-gray-300">Genre</th>
                <th className="text-left py-3 px-4 text-gray-300">Rating</th>
                <th className="text-left py-3 px-4 text-gray-300">Reviews</th>
                <th className="text-left py-3 px-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="border-b border-dark-700 hover:bg-dark-700/30">
                  <td className="py-3 px-4">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-dark-700 rounded flex items-center justify-center">
                        🎬
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{movie.title}</td>
                  <td className="py-3 px-4 text-gray-400">{movie.year}</td>
                  <td className="py-3 px-4 text-gray-400">{movie.genre}</td>
                  <td className="py-3 px-4 text-yellow-400">
                    ⭐ {movie.avgRating?.toFixed(1) || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{movie.reviewCount || 0}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      Delete
                    </button>
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
