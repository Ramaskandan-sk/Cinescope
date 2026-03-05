import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple admin check (in production, use proper authentication)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin credentials')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Access the admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="input-field"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Login as Admin
          </button>
        </form>

        <div className="mt-6 p-4 bg-dark-700 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Demo Credentials:<br />
            Username: <span className="text-primary-500">admin</span><br />
            Password: <span className="text-primary-500">admin123</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
