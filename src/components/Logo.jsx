const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl' }
  }

  const currentSize = sizes[size] || sizes.md

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`${currentSize.icon} relative`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Circle - Red Gradient */}
          <circle cx="50" cy="50" r="48" fill="url(#redGradient)" />
          
          {/* Film Strip Pattern */}
          <rect x="20" y="35" width="60" height="30" fill="#1e293b" rx="2" />
          
          {/* Film Holes - Left */}
          <rect x="22" y="38" width="4" height="4" fill="#dc2626" rx="1" />
          <rect x="22" y="46" width="4" height="4" fill="#dc2626" rx="1" />
          <rect x="22" y="54" width="4" height="4" fill="#dc2626" rx="1" />
          
          {/* Film Holes - Right */}
          <rect x="74" y="38" width="4" height="4" fill="#dc2626" rx="1" />
          <rect x="74" y="46" width="4" height="4" fill="#dc2626" rx="1" />
          <rect x="74" y="54" width="4" height="4" fill="#dc2626" rx="1" />
          
          {/* Center Frame */}
          <rect x="30" y="40" width="40" height="20" fill="url(#yellowGradient)" rx="2" />
          
          {/* Play Button Triangle */}
          <path d="M45 45 L45 55 L55 50 Z" fill="#0f172a" />
          
          {/* Shine Effect */}
          <circle cx="35" cy="35" r="8" fill="white" opacity="0.2" />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`${currentSize.text} font-bold text-white tracking-tight`}>
          Cine<span className="text-primary-500">Scope</span>
        </span>
      )}
    </div>
  )
}

export default Logo
