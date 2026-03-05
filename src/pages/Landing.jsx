import { Link } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

const Landing = () => {
  const { user } = useContext(AuthContext)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Discover Your Next Favorite Film",
      subtitle: "Join millions of movie lovers in the ultimate cinematic community",
      image: "🎬"
    },
    {
      title: "Share Your Movie Passion",
      subtitle: "Write reviews, join discussions, and connect with fellow film enthusiasts",
      image: "🍿"
    },
    {
      title: "AI-Powered Movie Experience",
      subtitle: "Smart recommendations and spoiler-free browsing with advanced AI",
      image: "🤖"
    }
  ]

  const features = [
    {
      icon: '⭐',
      title: 'Smart Reviews',
      description: 'AI-powered sentiment analysis and spoiler detection for better reviews',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: '💬',
      title: 'Community Discussions',
      description: 'Engage in threaded discussions with upvoting and real-time interactions',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      icon: '🎯',
      title: 'Personalized Recommendations',
      description: 'Get movie suggestions based on your viewing history and preferences',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      icon: '📱',
      title: 'Cross-Platform Sync',
      description: 'Access your watchlist and reviews across all your devices seamlessly',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: '🏆',
      title: 'Achievement System',
      description: 'Earn badges and unlock features as you contribute to the community',
      gradient: 'from-red-400 to-yellow-500'
    },
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Find movies by genre, year, rating, cast, and advanced filters',
      gradient: 'from-indigo-400 to-cyan-500'
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Film Critic",
      content: "CineScope has revolutionized how I discover and discuss films. The AI features are incredibly accurate!",
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Rodriguez",
      role: "Movie Enthusiast",
      content: "The community here is amazing. I've found so many hidden gems through the recommendations.",
      avatar: "👨‍🎨"
    },
    {
      name: "Emma Thompson",
      role: "Casual Viewer",
      content: "Love the spoiler detection! I can read reviews without worrying about plot reveals.",
      avatar: "👩‍🎓"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-900 to-accent-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container-custom section-padding">
          <div className="text-center space-y-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <span className="text-9xl animate-bounce-slow filter drop-shadow-2xl">
                {heroSlides[currentSlide].image}
              </span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-8xl font-black text-white text-shadow leading-tight">
                <span className="gradient-text">{heroSlides[currentSlide].title}</span>
              </h1>
              <p className="text-2xl sm:text-3xl text-gray-300 max-w-4xl mx-auto font-light">
                {heroSlides[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
              {user ? (
                <Link to="/home" className="btn-primary text-xl">
                  🎬 Explore Movies
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-xl">
                    🚀 Get Started Free
                  </Link>
                  <Link to="/login" className="btn-secondary text-xl">
                    👋 Welcome Back
                  </Link>
                </>
              )}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-3 pt-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary-500 w-8' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why <span className="gradient-text">CineScope</span> Stands Out
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of movie discovery with our cutting-edge features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover p-8 text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`text-6xl mb-6 p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} w-fit mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-primary-900/20 to-accent-900/20">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl font-black gradient-text">50K+</div>
              <div className="text-gray-300 text-xl font-medium">Movies</div>
              <div className="text-gray-500">Curated Collection</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black gradient-text">2M+</div>
              <div className="text-gray-300 text-xl font-medium">Reviews</div>
              <div className="text-gray-500">Community Insights</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black gradient-text">500K+</div>
              <div className="text-gray-300 text-xl font-medium">Members</div>
              <div className="text-gray-500">Active Community</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black gradient-text">99%</div>
              <div className="text-gray-300 text-xl font-medium">Satisfaction</div>
              <div className="text-gray-500">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="text-6xl mb-6">{testimonial.avatar}</div>
                <p className="text-gray-300 text-lg mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-white text-xl">{testimonial.name}</div>
                  <div className="text-primary-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold text-white text-shadow">
              Ready to Transform Your Movie Experience?
            </h2>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto">
              Join thousands of movie enthusiasts and discover your next favorite film today
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 transform hover:scale-105">
                  🎬 Start Your Journey
                </Link>
                <Link to="/home" className="glass text-white hover:bg-white/10 font-semibold py-4 px-12 rounded-xl text-xl transition-all duration-300">
                  👀 Browse Movies
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-dark-900 border-t border-dark-700">
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🎬</span>
                <span className="text-2xl font-bold gradient-text">CineScope</span>
              </div>
              <p className="text-gray-400">
                The ultimate destination for movie enthusiasts worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/home" className="hover:text-primary-400 transition">Browse Movies</Link></li>
                <li><Link to="/register" className="hover:text-primary-400 transition">Write Reviews</Link></li>
                <li><Link to="/register" className="hover:text-primary-400 transition">Join Discussions</Link></li>
                <li><Link to="/register" className="hover:text-primary-400 transition">Create Watchlist</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary-400 transition">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Feedback</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-400 transition text-2xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition text-2xl">🐦</a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition text-2xl">📷</a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition text-2xl">🎵</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CineScope. Built with ❤️ for movie enthusiasts worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
