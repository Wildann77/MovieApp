import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../src/models/movie.model.js';

// Load environment variables
dotenv.config();

const addMoviePosters = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Sample movie posters from TMDB or placeholder images
    const moviePosters = [
      'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', // Spider-Man
      'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', // Parasite
      'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
      'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', // The Dark Knight
      'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers
      'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', // Parasite
      'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', // The Dark Knight
      'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers
      'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', // Spider-Man
      'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
    ];

    console.log('\n🎬 Adding movie posters...');

    // Get all movies
    const movies = await Movie.find({}).limit(10);
    console.log(`📊 Found ${movies.length} movies to update`);

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const posterUrl = moviePosters[i % moviePosters.length];
      
      movie.poster = posterUrl;
      await movie.save();
      
      console.log(`✅ Updated poster for "${movie.title}" (${movie.year})`);
    }

    // Show updated movies
    console.log('\n📋 Updated movies with posters:');
    const updatedMovies = await Movie.find({}, 'title year poster').limit(10);
    updatedMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.year})`);
      console.log(`   Poster: ${movie.poster}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
addMoviePosters();
