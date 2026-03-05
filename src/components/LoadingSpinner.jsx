const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner