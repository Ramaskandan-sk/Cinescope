import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const unreadOnly = filter === 'unread'
      const res = await axios.get(`/api/notifications?unreadOnly=${unreadOnly}`)
      setNotifications(res.data.notifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      follow: '👤',
      like: '❤️',
      comment: '💬',
      reply: '↩️',
      mention: '@',
      system: '🔔'
    }
    return icons[type] || '🔔'
  }

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    )
  }

  return (
    <div className="container-custom section-padding">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-white">
          🔔 <span className="gradient-text">Notifications</span>
        </h1>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllAsRead} className="btn-secondary">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-dark-700">
        {['all', 'unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-4 px-4 font-semibold transition-all duration-200 ${
              filter === tab
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <Link
              key={notification._id}
              to={notification.link || '#'}
              onClick={() => !notification.read && markAsRead(notification._id)}
              className={`card p-6 flex items-start space-x-4 hover:border-primary-500/50 transition-all duration-300 animate-slide-up ${
                !notification.read ? 'bg-primary-900/10 border-primary-500/30' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-4xl">{getNotificationIcon(notification.type)}</div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">{notification.title}</h3>
                    <p className="text-gray-300">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                  {notification.fromUser && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                        {notification.fromUser.username?.[0]?.toUpperCase()}
                      </div>
                      <span>{notification.fromUser.username}</span>
                    </div>
                  )}
                  <span>•</span>
                  <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">🔔</div>
          <h3 className="text-3xl font-bold text-white mb-4">No notifications</h3>
          <p className="text-gray-400 text-lg">
            {filter === 'unread' ? 'All caught up!' : 'You have no notifications yet'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Notifications
