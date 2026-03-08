import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Settings = () => {
  const { user, logout } = useContext(AuthContext)
  const { theme, setTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [showEmail, setShowEmail] = useState(false)
  
  // Account settings
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI states
  const [activeTab, setActiveTab] = useState('appearance')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    showMessage('Theme updated successfully')
  }

  const handleExportWatchlist = async () => {
    console.log('Export Watchlist button clicked!')
    
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        showError('Please login to export watchlist')
        setLoading(false)
        return
      }
      
      console.log('Fetching watchlist for export...')
      const { data } = await axios.get('/api/watchlist/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('Watchlist data received:', data)
      
      if (!data || data.length === 0) {
        showError('Your watchlist is empty')
        setLoading(false)
        return
      }
      
      // Create CSV content
      const csvContent = [
        ['Title', 'Year', 'Genre', 'Rating', 'Added Date'],
        ...data.map(item => [
          item.movieId?.title || 'N/A',
          item.movieId?.year || 'N/A',
          item.movieId?.genre?.join(', ') || 'N/A',
          item.movieId?.avgRating || 'N/A',
          new Date(item.addedAt).toLocaleDateString()
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
      
      console.log('CSV content created:', csvContent.substring(0, 100) + '...')
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cinescope-watchlist-${new Date().toISOString().split('T')[0]}.csv`
      a.style.display = 'none'
      document.body.appendChild(a)
      console.log('Triggering download...')
      a.click()
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        console.log('Download cleanup complete')
      }, 100)
      
      showMessage('Watchlist exported successfully')
    } catch (err) {
      console.error('Export watchlist error:', err)
      showError(err.response?.data?.message || err.message || 'Failed to export watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    console.log('Export All Data button clicked!')
    
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        showError('Please login to export data')
        setLoading(false)
        return
      }
      
      console.log('Fetching all user data for export...')
      
      // Fetch all user data
      const [watchlistRes, reviewsRes] = await Promise.all([
        axios.get('/api/watchlist/me', { 
          headers: { Authorization: `Bearer ${token}` } 
        }).catch(err => {
          console.error('Watchlist fetch error:', err)
          return { data: [] }
        }),
        axios.get('/api/reviews/user/me', { 
          headers: { Authorization: `Bearer ${token}` } 
        }).catch(err => {
          console.error('Reviews fetch error:', err)
          return { data: [] }
        })
      ])
      
      console.log('Data fetched:', {
        watchlist: watchlistRes.data.length,
        reviews: reviewsRes.data.length
      })
      
      const userData = {
        user: {
          username: user?.username || 'Unknown',
          email: user?.email || 'Unknown',
          createdAt: user?.createdAt || new Date().toISOString()
        },
        watchlist: watchlistRes.data,
        reviews: reviewsRes.data,
        exportedAt: new Date().toISOString()
      }
      
      console.log('Creating JSON file...')
      
      // Download JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cinescope-data-${new Date().toISOString().split('T')[0]}.json`
      a.style.display = 'none'
      document.body.appendChild(a)
      console.log('Triggering download...')
      a.click()
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        console.log('Download cleanup complete')
      }, 100)
      
      showMessage('Data exported successfully')
    } catch (err) {
      console.error('Export data error:', err)
      showError(err.response?.data?.message || err.message || 'Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/auth/profile', 
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showMessage('Profile updated successfully')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showMessage('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    const confirmation = window.prompt('Type "DELETE" to confirm account deletion:')
    if (confirmation !== 'DELETE') {
      return
    }
    
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      await axios.delete('/api/auth/account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      logout()
      navigate('/')
    } catch (err) {
      showError('Failed to delete account')
      setLoading(false)
    }
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  const showError = (err) => {
    setError(err)
    setMessage('')
    setTimeout(() => setError(''), 3000)
  }

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'data', label: 'Data & Export', icon: '📦' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {message && (
        <div className="mb-6 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg animate-fade-in">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg animate-fade-in">
          ✗ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'text-gray-300 hover:bg-dark-700'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Appearance</h2>
                  <p className="text-gray-400 mb-6">Customize how CineScope looks for you</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-dark-800'
                          : 'border-dark-700 bg-dark-900 hover:border-dark-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">🌙</span>
                        {theme === 'dark' && <span className="text-primary-500">✓</span>}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">Dark Mode</div>
                        <div className="text-sm text-gray-400">Easy on the eyes</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                        theme === 'light'
                          ? 'border-primary-500 bg-dark-800'
                          : 'border-dark-700 bg-dark-900 hover:border-dark-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">☀️</span>
                        {theme === 'light' && <span className="text-primary-500">✓</span>}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">Light Mode</div>
                        <div className="text-sm text-gray-400">Coming soon</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-dark-700">
                  <h3 className="font-semibold text-white mb-4">Display Options</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Compact mode</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Show animations</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
                  <p className="text-gray-400 mb-6">Manage your account information</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>

                <div className="pt-6 border-t border-dark-700">
                  <h3 className="font-semibold text-white mb-4">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>

                <div className="pt-6 border-t border-red-900/30">
                  <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Notification Preferences</h2>
                  <p className="text-gray-400 mb-6">Choose what notifications you want to receive</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive notifications via email</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Push Notifications</div>
                      <div className="text-sm text-gray-400">Receive push notifications in browser</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="toggle"
                    />
                  </label>
                </div>

                <div className="pt-6 border-t border-dark-700">
                  <h3 className="font-semibold text-white mb-4">Notification Types</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">New followers</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Likes on reviews</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Comments on posts</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Mentions</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Chat messages</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Privacy Settings</h2>
                  <p className="text-gray-400 mb-6">Control who can see your information</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Profile Visibility</label>
                  <select
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                    className="input-field"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Show Email</div>
                      <div className="text-sm text-gray-400">Display email on profile</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showEmail}
                      onChange={(e) => setShowEmail(e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Show Watchlist</div>
                      <div className="text-sm text-gray-400">Let others see your watchlist</div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Show Activity</div>
                      <div className="text-sm text-gray-400">Display recent activity on profile</div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                </div>

                <div className="pt-6 border-t border-dark-700">
                  <h3 className="font-semibold text-white mb-4">Blocked Users</h3>
                  <p className="text-gray-400 text-sm mb-4">You haven't blocked anyone yet</p>
                </div>
              </div>
            )}

            {/* Data & Export Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data & Export</h2>
                  <p className="text-gray-400 mb-6">Download your data and manage storage</p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">Export Watchlist</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Download your watchlist as a CSV file
                        </p>
                      </div>
                      <button
                        onClick={handleExportWatchlist}
                        disabled={loading}
                        className="btn-ghost"
                      >
                        📥 Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">Export All Data</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Download all your data including reviews, watchlist, and activity
                        </p>
                      </div>
                      <button
                        onClick={handleExportData}
                        disabled={loading}
                        className="btn-primary"
                      >
                        📦 Export JSON
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
                    <h3 className="font-semibold text-white mb-2">Storage Usage</h3>
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Reviews</span>
                        <span className="text-white">2.4 KB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Watchlist</span>
                        <span className="text-white">1.2 KB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Messages</span>
                        <span className="text-white">5.8 KB</span>
                      </div>
                      <div className="pt-3 border-t border-dark-700 flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-primary-500">9.4 KB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
                    <h3 className="font-semibold text-white mb-2">Clear Cache</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Clear cached data to free up space
                    </p>
                    <button className="btn-ghost">
                      🗑️ Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
