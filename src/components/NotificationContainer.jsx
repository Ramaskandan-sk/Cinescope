import NotificationToast from './NotificationToast'

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index 
          }}
        >
          <NotificationToast
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => onRemove(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default NotificationContainer