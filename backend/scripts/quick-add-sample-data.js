import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Actor from '../src/models/actor.model.js';
import Director from '../src/models/director.model.js';
import Writer from '../src/models/writer.model.js';
import Genre from '../src/models/genre.model.js';

// Load environment variables
dotenv.config();

// Sample data
const sampleActors = [
  { name: 'Tom Hanks', bio: 'Academy Award-winning actor known for his versatile roles.' },
  { name: 'Leonardo DiCaprio', bio: 'Oscar-winning actor and environmental activist.' },
  { name: 'Meryl Streep', bio: 'Most nominated actor in Academy Award history.' }
];

const sampleDirectors = [
  { name: 'Christopher Nolan', bio: 'Director known for complex narratives and practical effects.' },
  { name: 'Steven Spielberg', bio: 'Legendary director of blockbuster films.' }
];

const sampleWriters = [
  { name: 'Aaron Sorkin', bio: 'Screenwriter known for fast-paced dialogue.' },
  { name: 'Charlie Kaufman', bio: 'Screenwriter known for surreal and complex narratives.' }
];

const sampleGenres = [
  { name: 'Action', description: 'High-energy films with physical stunts and chases.' },
  { name: 'Comedy', description: 'Films designed to make audiences laugh.' },
  { name: 'Drama', description: 'Serious, plot-driven presentations.' }
];

async function addSampleData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('MongoDB URL:', process.env.MONGODB_URL);
    
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingActors = await Actor.countDocuments();
    const existingDirectors = await Director.countDocuments();
    const existingWriters = await Writer.countDocuments();
    const existingGenres = await Genre.countDocuments();

    console.log('📊 Current data count:');
    console.log(`  Actors: ${existingActors}`);
    console.log(`  Directors: ${existingDirectors}`);
    console.log(`  Writers: ${existingWriters}`);
    console.log(`  Genres: ${existingGenres}`);

    if (existingActors === 0) {
      console.log('👥 Adding sample actors...');
      await Actor.insertMany(sampleActors);
      console.log(`✅ Added ${sampleActors.length} actors`);
    } else {
      console.log('👥 Actors already exist, skipping...');
    }

    if (existingDirectors === 0) {
      console.log('🎬 Adding sample directors...');
      await Director.insertMany(sampleDirectors);
      console.log(`✅ Added ${sampleDirectors.length} directors`);
    } else {
      console.log('🎬 Directors already exist, skipping...');
    }

    if (existingWriters === 0) {
      console.log('✍️ Adding sample writers...');
      await Writer.insertMany(sampleWriters);
      console.log(`✅ Added ${sampleWriters.length} writers`);
    } else {
      console.log('✍️ Writers already exist, skipping...');
    }

    if (existingGenres === 0) {
      console.log('🏷️ Adding sample genres...');
      await Genre.insertMany(sampleGenres);
      console.log(`✅ Added ${sampleGenres.length} genres`);
    } else {
      console.log('🏷️ Genres already exist, skipping...');
    }

    console.log('\n🎉 Sample data setup completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the script
addSampleData();
