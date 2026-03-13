import { Link } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Logo from '../components/Logo'
import axios from 'axios'

const Landing = () => {
  const { user } = useContext(AuthContext)
  const [featuredMovies, setFeaturedMovies] = useState([])

  useEffect(() => {
    fetchFeaturedMovies()
  }, [])

  const fetchFeaturedMovies = async () => {
    try {
      const { data } = await axios.get('/api/movies?limit=3&sortBy=rating')
      setFeaturedMovies(data.slice(0, 3))
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  const stats = [
    { value: '50K+', label: 'MOVIES', sublabel: 'Curated collection' },
    { value: '2M+', label: 'REVIEWS', sublabel: 'Community insights' },
    { value: '500K+', label: 'MEMBERS', sublabel: 'Active users' },
    { value: '99%', label: 'SATISFACTION', sublabel: 'User rating' }
  ]

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      title: 'Smart Reviews',
      description: 'AI-powered sentiment analysis for every film review to help you find the best content.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Community Discussions',
      description: 'Join vibrant movie discussions, share your thoughts, and debate with fellow cinephiles.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Personalized Recommendations',
      description: 'Tailored suggestions based on your viewing history, ratings, and favorite genres.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
      title: 'Cross-Platform Sync',
      description: 'Seamlessly access your watchlists, reviews, and progress across all your devices.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      title: 'Achievement System',
      description: 'Earn badges, rewards, and unlock features as you engage with the community.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Advanced Search',
      description: 'Filter by genre, year, rating, cast, and more to find exactly what you want to watch.'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                AI-Powered<br />
                Movie<br />
                Experience
              </h1>
              
              <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                Discover, review, and discuss movies with the ultimate cinematic community platform. Your next favorite film is just a click away.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {user ? (
                  <Link 
                    to="/home" 
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Browse Movies
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Get Started
                    </Link>
                    <Link 
                      to="/home" 
                      className="px-8 py-4 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-lg border border-dark-600 transition-all duration-200"
                    >
                      Browse Movies
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right content - Movie posters */}
            <div className="relative hidden lg:block">
              <div className="relative h-[500px]">
                {featuredMovies.length > 0 ? (
                  <>
                    {/* First movie poster - back */}
                    <div className="absolute top-0 right-0 w-64 h-96 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-3 transition-all duration-300 hover:scale-105">
                      <img 
                        src={featuredMovies[0]?.poster || '/placeholder.jpg'} 
                        alt={featuredMovies[0]?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg">{featuredMovies[0]?.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white text-sm">{featuredMovies[0]?.avgRating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Second movie poster - middle */}
                    {featuredMovies[1] && (
                      <div className="absolute top-12 right-12 w-64 h-96 rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105 z-10">
                        <img 
                          src={featuredMovies[1]?.poster || '/placeholder.jpg'} 
                          alt={featuredMovies[1]?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg">{featuredMovies[1]?.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white text-sm">{featuredMovies[1]?.avgRating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Third movie poster - front */}
                    {featuredMovies[2] && (
                      <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 z-20">
                        <img 
                          src={featuredMovies[2]?.poster || '/placeholder.jpg'} 
                          alt={featuredMovies[2]?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg">{featuredMovies[2]?.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white text-sm">{featuredMovies[2]?.avgRating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Placeholder cards while loading */}
                    <div className="absolute top-0 right-0 w-64 h-96 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl backdrop-blur-sm border border-white/10 transform rotate-6 animate-pulse"></div>
                    <div className="absolute top-12 right-12 w-64 h-96 bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-2xl backdrop-blur-sm border border-white/10 transform -rotate-3 animate-pulse"></div>
                    <div className="relative w-64 h-96 bg-gradient-to-br from-teal-900/40 to-cyan-900/40 rounded-2xl backdrop-blur-sm border border-white/10 animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-800/50 border-y border-dark-700">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-white">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-400 tracking-wider">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-dark-900">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Premium Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of movie discovery and discussion with our suite of advanced tools designed for true cinephiles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-dark-800/50 hover:bg-dark-800 rounded-2xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500 mb-6 group-hover:bg-primary-600/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-700 py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <Logo size="md" showText={true} />
              <p className="text-sm text-gray-400">
                Your ultimate cinematic companion. Track, review, and discover movies with AI.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/home" className="hover:text-primary-400 transition">Browse Movies</Link></li>
                <li><Link to="/trending" className="hover:text-primary-400 transition">Trending Now</Link></li>
                <li><Link to="/genres" className="hover:text-primary-400 transition">Top Reviewers</Link></li>
                <li><Link to="/admin" className="hover:text-primary-400 transition">Pro Membership</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-gray-400 mb-4">Get weekly movie recommendations</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 px-4 py-2 bg-dark-800 border border-dark-600 rounded-l-lg text-white text-sm focus:outline-none focus:border-primary-500"
                />
                <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">© 2026 CineScope. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
