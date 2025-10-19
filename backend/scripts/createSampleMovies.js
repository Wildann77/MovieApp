import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../src/models/movie.model.js';
import User from '../src/models/user.model.js';
import Director from '../src/models/director.model.js';
import Genre from '../src/models/genre.model.js';
import Actor from '../src/models/actor.model.js';

// Load environment variables
dotenv.config();

const createSampleMovies = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if movies already exist
    const existingMovies = await Movie.countDocuments();
    if (existingMovies > 0) {
      console.log(`📊 Found ${existingMovies} existing movies. Skipping creation.`);
      await mongoose.disconnect();
      return;
    }

    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@movieapp.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    // Create or get genres
    const genres = [
      { name: 'Action', description: 'High-energy films with physical stunts and chases' },
      { name: 'Drama', description: 'Serious plot-driven presentations' },
      { name: 'Comedy', description: 'Humorous and entertaining films' },
      { name: 'Thriller', description: 'Suspenseful and exciting films' },
      { name: 'Sci-Fi', description: 'Science fiction films' }
    ];

    const createdGenres = [];
    for (const genreData of genres) {
      let genre = await Genre.findOne({ name: genreData.name });
      if (!genre) {
        genre = new Genre(genreData);
        await genre.save();
      }
      createdGenres.push(genre);
    }

    // Create or get directors
    const directors = [
      { name: 'Christopher Nolan', bio: 'British-American filmmaker known for complex narratives' },
      { name: 'Martin Scorsese', bio: 'American filmmaker known for crime films' },
      { name: 'Steven Spielberg', bio: 'American filmmaker and producer' },
      { name: 'Quentin Tarantino', bio: 'American filmmaker known for nonlinear narratives' },
      { name: 'Ridley Scott', bio: 'British filmmaker known for science fiction films' }
    ];

    const createdDirectors = [];
    for (const directorData of directors) {
      let director = await Director.findOne({ name: directorData.name });
      if (!director) {
        director = new Director(directorData);
        await director.save();
      }
      createdDirectors.push(director);
    }

    // Create or get actors
    const actors = [
      { name: 'Leonardo DiCaprio', bio: 'American actor and film producer' },
      { name: 'Tom Hardy', bio: 'English actor known for intense performances' },
      { name: 'Robert Downey Jr.', bio: 'American actor and producer' },
      { name: 'Scarlett Johansson', bio: 'American actress and singer' },
      { name: 'Brad Pitt', bio: 'American actor and film producer' }
    ];

    const createdActors = [];
    for (const actorData of actors) {
      let actor = await Actor.findOne({ name: actorData.name });
      if (!actor) {
        actor = new Actor(actorData);
        await actor.save();
      }
      createdActors.push(actor);
    }

    // Sample movies with posters
    const sampleMovies = [
      {
        title: 'The Dark Knight',
        year: 2008,
        duration: '152 minutes',
        poster: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
        heroImage: 'https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
        trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        director: createdDirectors[0]._id,
        genres: [createdGenres[0]._id, createdGenres[3]._id], // Action, Thriller
        cast: [createdActors[1]._id], // Tom Hardy
        user: adminUser._id
      },
      {
        title: 'Inception',
        year: 2010,
        duration: '148 minutes',
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        heroImage: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        director: createdDirectors[0]._id,
        genres: [createdGenres[0]._id, createdGenres[4]._id], // Action, Sci-Fi
        cast: [createdActors[0]._id], // Leonardo DiCaprio
        user: adminUser._id
      },
      {
        title: 'The Wolf of Wall Street',
        year: 2013,
        duration: '180 minutes',
        poster: 'https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg',
        heroImage: 'https://image.tmdb.org/t/p/w1280/p7fxC4V4VtVq5Y6bHjO4vj8K9F2.jpg',
        trailer: 'https://www.youtube.com/watch?v=iszwuX1AK6A',
        description: 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.',
        director: createdDirectors[1]._id,
        genres: [createdGenres[1]._id, createdGenres[2]._id], // Drama, Comedy
        cast: [createdActors[0]._id, createdActors[4]._id], // Leonardo DiCaprio, Brad Pitt
        user: adminUser._id
      },
      {
        title: 'Iron Man',
        year: 2008,
        duration: '126 minutes',
        poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
        heroImage: 'https://image.tmdb.org/t/p/w1280/6WBeq4fCct7EJ4AT94WY2nx8sNT.jpg',
        trailer: 'https://www.youtube.com/watch?v=8ugaeA-nMTc',
        description: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
        director: createdDirectors[2]._id,
        genres: [createdGenres[0]._id, createdGenres[4]._id], // Action, Sci-Fi
        cast: [createdActors[2]._id], // Robert Downey Jr.
        user: adminUser._id
      },
      {
        title: 'Pulp Fiction',
        year: 1994,
        duration: '154 minutes',
        poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        heroImage: 'https://image.tmdb.org/t/p/w1280/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
        trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        director: createdDirectors[3]._id,
        genres: [createdGenres[0]._id, createdGenres[1]._id], // Action, Drama
        cast: [createdActors[0]._id, createdActors[4]._id], // Leonardo DiCaprio, Brad Pitt
        user: adminUser._id
      }
    ];

    console.log('\n🎬 Creating sample movies...');

    for (const movieData of sampleMovies) {
      const movie = new Movie(movieData);
      await movie.save();
      console.log(`✅ Created movie: "${movie.title}" (${movie.year})`);
    }

    // Show created movies
    console.log('\n📋 Created movies:');
    const createdMovies = await Movie.find({}, 'title year poster director genres cast')
      .populate('director', 'name')
      .populate('genres', 'name')
      .populate('cast', 'name')
      .limit(10);
    
    createdMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.year})`);
      console.log(`   Director: ${movie.director?.name}`);
      console.log(`   Genres: ${movie.genres?.map(g => g.name).join(', ')}`);
      console.log(`   Cast: ${movie.cast?.map(a => a.name).join(', ')}`);
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
createSampleMovies();
