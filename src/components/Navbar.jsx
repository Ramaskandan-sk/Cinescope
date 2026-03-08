import { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import Logo from './Logo'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { unreadCount } = useNotifications(user)

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
          <Link to="/" className="group">
            <Logo size="md" showText={true} />
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
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg hover:bg-dark-700 transition-colors group"
                  title="Notifications"
                >
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Chats */}
                <Link
                  to="/chats"
                  className="relative p-2 rounded-lg hover:bg-dark-700 transition-colors group"
                  title="Chats"
                >
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>

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
                  to="/notifications"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <span>🔔</span>
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/chats"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <span>💬</span>
                  <span>Chats</span>
                </Link>
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
