import { useState } from 'react'

export const useNotification = () => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const notification = { id, message, type, duration }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration + 300) // Add 300ms for animation
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (message, duration) => addNotification(message, 'success', duration),
    error: (message, duration) => addNotification(message, 'error', duration),
    warning: (message, duration) => addNotification(message, 'warning', duration),
    info: (message, duration) => addNotification(message, 'info', duration),
  }
}