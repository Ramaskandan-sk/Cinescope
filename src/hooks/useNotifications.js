import { useState, useEffect } from 'react'
import axios from 'axios'

export const useNotifications = (user) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(data)
      const unread = data.filter(n => !n.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  return {
    unreadCount,
    notifications,
    fetchNotifications,
    markAsRead,
    deleteNotification
  }
}
