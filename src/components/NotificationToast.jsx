import { useState, useEffect } from 'react'

const NotificationToast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500 text-green-400'
      case 'error':
        return 'bg-red-500/20 border-red-500 text-red-400'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
      default:
        return 'bg-blue-500/20 border-blue-500 text-blue-400'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`
      fixed top-20 right-4 z-50 max-w-sm w-full
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        glass rounded-xl border p-4 shadow-lg
        ${getTypeStyles()}
      `}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getIcon()}</span>
          <p className="flex-1 font-medium">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationToast