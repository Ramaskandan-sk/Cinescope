import express from 'express'
import Movie from '../models/Movie.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      genre, 
      year, 
      minRating, 
      sortBy = 'avgRating',
      page = 1,
      limit = 20 
    } = req.query

    // Build query
    let query = {}
    
    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }
    
    if (genre) {
      query.genre = genre
    }
    
    if (year) {
      query.year = parseInt(year)
    }
    
    if (minRating) {
      query.avgRating = { $gte: parseFloat(minRating) }
    }

    // Build sort
    let sort = {}
    switch (sortBy) {
      case 'rating':
        sort = { avgRating: -1 }
        break
      case 'year':
        sort = { year: -1 }
        break
      case 'title':
        sort = { title: 1 }
        break
      case 'popularity':
      default:
        sort = { reviewCount: -1, avgRating: -1 }
    }

    const movies = await Movie.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.json(movies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/trending', async (req, res) => {
  try {
    const { timeframe = 'week' } = req.query
    
    // For demo purposes, return movies sorted by rating and review count
    // In production, you'd track views/interactions over time
    const movies = await Movie.find()
      .sort({ reviewCount: -1, avgRating: -1 })
      .limit(20)
    
    res.json(movies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    res.json(movie)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const movie = await Movie.create(req.body)
    res.status(201).json(movie)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    res.json({ message: 'Movie deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
