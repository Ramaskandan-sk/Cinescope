import { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/home', label: 'Movies', icon: '🎬' },
    { path: '/trending', label: 'Trending', icon: '🔥' },
    { path: '/genres', label: 'Genres', icon: '🎭' },
  ]

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🎬</div>
            <div className="flex flex-col">
              <span className="text-2xl font-black gradient-text">CineScope</span>
              <span className="text-xs text-gray-400 -mt-1">Movie Community</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/watchlist"
                  className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/watchlist')
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <span>📚</span>
                  <span>Watchlist</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-white font-medium">{user.username}</span>
                    <span className="text-gray-400">▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>👤</span>
                        <span className="text-white">Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>⚙️</span>
                        <span className="text-white">Settings</span>
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>🔐</span>
                        <span className="text-gray-400 text-sm">Admin</span>
                      </Link>
                      <hr className="border-white/10 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost hidden md:inline-flex"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/watchlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <span>📚</span>
                  <span>Watchlist</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <span>👤</span>
                  <span>Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <span>🔑</span>
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-600 text-white transition-colors"
                >
                  <span>🚀</span>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
