import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [devToken, setDevToken] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setDevToken('')

    try {
      const res = await axios.post('/api/password-reset/request', { email })
      setMessage(res.data.message)
      if (res.data.devToken) {
        setDevToken(res.data.devToken)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-400">Enter your email to reset your password</p>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium mb-2">{message}</p>
            {devToken && (
              <div className="mt-3 p-3 bg-dark-700 rounded">
                <p className="text-xs text-gray-400 mb-2">Development Mode - Reset Link:</p>
                <Link 
                  to={`/reset-password/${devToken}`}
                  className="text-primary-400 hover:text-primary-300 text-sm break-all"
                >
                  /reset-password/{devToken}
                </Link>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <Link to="/login" className="block text-primary-400 hover:text-primary-300 transition">
            ← Back to Login
          </Link>
          <Link to="/register" className="block text-gray-400 hover:text-white transition text-sm">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
