# 🎬 CineScope - Professional Movie Community Platform

A modern, feature-rich movie discussion and review platform built with React, Node.js, and MongoDB. Experience cinema like never before with our AI-powered features and stunning UI.

## ✨ Features

### 🎯 Core Features
- 🔐 **Secure Authentication** - JWT-based user system
- 🎥 **Movie Discovery** - Browse 50K+ movies with advanced search
- ⭐ **Smart Reviews** - AI-powered sentiment analysis & spoiler detection
- 💬 **Community Discussions** - Threaded conversations with voting
- 📚 **Personal Watchlist** - Track movies you want to watch
- 👤 **User Profiles** - Personalized dashboards and activity tracking

### 🚀 Advanced Features
- 🔥 **Trending Movies** - Real-time trending content
- 🎭 **Genre Explorer** - Browse by 10+ movie genres
- 🔍 **Advanced Search** - Filter by year, rating, genre, and more
- 📱 **Responsive Design** - Perfect on all devices
- 🌙 **Dark Theme** - Professional dark UI with accent colors
- ⚡ **Fast Performance** - Optimized loading and animations

### 🤖 AI-Powered
- 📊 **Sentiment Analysis** - Automatic review mood detection
- ⚠️ **Spoiler Detection** - Smart spoiler warnings
- 🎯 **Smart Recommendations** - Personalized movie suggestions
- 🏷️ **Auto-Tagging** - Intelligent content categorization

### 🎨 Professional UI/UX
- 🎨 **Modern Design** - Glass morphism and gradient effects
- ✨ **Smooth Animations** - Micro-interactions and transitions
- 🎯 **Intuitive Navigation** - User-friendly interface
- 📊 **Data Visualization** - Beautiful stats and charts
- 🔔 **Toast Notifications** - Real-time feedback system

## 🎨 Design System

### Color Palette
- **Primary**: Red gradient (#dc2626 to #b91c1c)
- **Accent**: Yellow gradient (#facc15 to #eab308)
- **Background**: Dark slate (#0f172a, #1e293b)
- **Glass**: Translucent overlays with backdrop blur

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300-900 for perfect hierarchy
- **Responsive**: Fluid typography scaling

### Components
- **Cards**: Glass morphism with hover effects
- **Buttons**: Gradient backgrounds with glow effects
- **Forms**: Floating labels and smooth focus states
- **Navigation**: Sticky header with dropdown menus

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Compass)
- npm or yarn

### Quick Setup

1. **Clone & Install**
```bash
git clone <repository>
cd cine-scope
npm install
cd backend && npm install
```

2. **Database Setup**
```bash
# Start MongoDB service
# Open MongoDB Compass
# Create database: cine_scope

# Seed sample data
cd backend
node seed.js
```

3. **Environment Setup**
```bash
# Backend .env is pre-configured for local development
# MONGO_URI=mongodb://127.0.0.1:27017/cine_scope
# PORT=5000
# JWT_SECRET=your_super_secret_jwt_key
```

4. **Start Development**
```bash
# Terminal 1: Backend
cd backend
npm run dev:safe

# Terminal 2: Frontend  
npm run dev
```

5. **Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## 🔐 Admin Access

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

**Admin Features:**
- Add/Delete movies
- View all movies in table format
- Upload movie posters
- Manage movie metadata

## 📱 Pages & Features

### 🏠 Landing Page
- Hero carousel with auto-rotation
- Feature showcase with animations
- Community testimonials
- Call-to-action sections
- Professional footer

### 🎬 Movies Hub
- Advanced search with filters
- Genre-based browsing
- Trending movies section
- Infinite scroll loading
- Movie cards with hover effects

### 🔥 Trending
- Real-time trending content
- Timeframe selection (day/week/month)
- Trending badges and indicators
- Social proof metrics

### 🎭 Genres
- Visual genre selection
- Color-coded categories
- Filter by multiple criteria
- Genre-specific statistics

### 🎥 Movie Details
- High-resolution posters
- Comprehensive movie info
- Review and discussion tabs
- Watchlist integration
- Social sharing

### 👤 User Profiles
- Activity dashboard
- Review history
- Watchlist management
- Achievement system
- Social connections

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Custom Hooks** - Reusable logic

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server
- **Git** - Version control

## 📁 Project Structure

```
cine-scope/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MovieCard.jsx   # Movie display card
│   │   ├── ReviewCard.jsx  # Review display
│   │   ├── SearchBar.jsx   # Search functionality
│   │   ├── FilterSidebar.jsx # Advanced filters
│   │   └── LoadingSpinner.jsx # Loading states
│   ├── pages/              # Page components
│   │   ├── Landing.jsx     # Homepage
│   │   ├── Home.jsx        # Movies hub
│   │   ├── Trending.jsx    # Trending movies
│   │   ├── Genres.jsx      # Genre browser
│   │   └── MovieDetail.jsx # Movie details
│   ├── hooks/              # Custom React hooks
│   │   └── useNotification.js # Toast notifications
│   ├── context/            # React context
│   │   └── AuthContext.jsx # Authentication
│   └── App.jsx            # Main app component
├── backend/
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration
│   └── server.js         # Express server
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Movies
```
GET  /api/movies           # Get movies (with filters)
GET  /api/movies/trending  # Get trending movies
GET  /api/movies/:id       # Get movie by ID
POST /api/movies           # Create movie (admin)
DELETE /api/movies/:id     # Delete movie (admin)
```

### Reviews
```
POST /api/reviews          # Create review
GET  /api/reviews/movie/:id # Get movie reviews
POST /api/reviews/:id/like  # Like review
DELETE /api/reviews/:id     # Delete review
```

### Advanced Features
```
GET  /api/movies?search=query      # Search movies
GET  /api/movies?genre=Action      # Filter by genre
GET  /api/movies?year=2024         # Filter by year
GET  /api/movies?minRating=4.0     # Filter by rating
GET  /api/movies?sortBy=popularity # Sort results
```

## 🎯 Performance Optimizations

- **Lazy Loading** - Images and components
- **Code Splitting** - Route-based chunks
- **Caching** - API response caching
- **Compression** - Gzip compression
- **CDN Ready** - Optimized for CDN delivery

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Cross-origin security
- **Helmet.js** - Security headers
- **Input Validation** - Data sanitization

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
# Set environment variables
# Deploy to cloud platform
```

### Database (MongoDB Atlas)
```bash
# Create Atlas cluster
# Update connection string
# Migrate data
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:
```javascript
colors: {
  primary: { /* Your primary colors */ },
  accent: { /* Your accent colors */ }
}
```

### Fonts
Update `src/index.css` for custom fonts:
```css
@import url('your-font-url');
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **TMDB** - Movie data and posters
- **Tailwind CSS** - Styling framework
- **React Community** - Amazing ecosystem
- **MongoDB** - Database platform

---

**Built with ❤️ for movie enthusiasts worldwide**

🌟 **Star this repo if you found it helpful!**
