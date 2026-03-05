import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Movie from './models/Movie.js'

dotenv.config()

const movies = [
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: 'Drama',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    avgRating: 4.8,
    reviewCount: 0
  },
  {
    title: 'The Godfather',
    year: 1972,
    genre: 'Crime',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    avgRating: 4.7,
    reviewCount: 0
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    avgRating: 4.6,
    reviewCount: 0
  },
  {
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Crime',
    poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    avgRating: 4.5,
    reviewCount: 0
  },
  {
    title: 'Inception',
    year: 2010,
    genre: 'Sci-Fi',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    avgRating: 4.4,
    reviewCount: 0
  },
  {
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-Fi',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    avgRating: 4.5,
    reviewCount: 0
  },
  {
    title: 'Parasite',
    year: 2019,
    genre: 'Thriller',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    avgRating: 4.6,
    reviewCount: 0
  },
  {
    title: 'The Matrix',
    year: 1999,
    genre: 'Sci-Fi',
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    avgRating: 4.3,
    reviewCount: 0
  }
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    await Movie.deleteMany({})
    console.log('Cleared existing movies')

    await Movie.insertMany(movies)
    console.log('✅ Seeded movies successfully')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDB()
