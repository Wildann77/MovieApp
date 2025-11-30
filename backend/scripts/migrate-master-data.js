import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Actor from '../src/models/actor.model.js';
import Director from '../src/models/director.model.js';
import Writer from '../src/models/writer.model.js';
import Genre from '../src/models/genre.model.js';
import User from '../src/models/user.model.js';

dotenv.config();

const migrateMasterData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to database');

    // Find admin user or create default user for existing data
    let defaultUser = await User.findOne({ role: 'admin' });
    
    if (!defaultUser) {
      // Create a default admin user for existing data
      defaultUser = new User({
        email: 'admin@system.com',
        username: 'system_admin',
        password: 'default_password_change_me', // You should change this
        role: 'admin'
      });
      await defaultUser.save();
      console.log('✅ Created default admin user for existing data');
    } else {
      console.log('✅ Found existing admin user:', defaultUser.username);
    }

    console.log('🔄 Starting migration...');

    // Update all existing records to have createdBy field
    const updatePromises = [
      Actor.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: defaultUser._id } }
      ),
      Director.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: defaultUser._id } }
      ),
      Writer.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: defaultUser._id } }
      ),
      Genre.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: defaultUser._id } }
      )
    ];

    const results = await Promise.all(updatePromises);
    
    console.log('✅ Migration completed:');
    console.log(`   - Actors updated: ${results[0].modifiedCount}`);
    console.log(`   - Directors updated: ${results[1].modifiedCount}`);
    console.log(`   - Writers updated: ${results[2].modifiedCount}`);
    console.log(`   - Genres updated: ${results[3].modifiedCount}`);

    // Verify migration
    const counts = await Promise.all([
      Actor.countDocuments({ createdBy: { $exists: true } }),
      Director.countDocuments({ createdBy: { $exists: true } }),
      Writer.countDocuments({ createdBy: { $exists: true } }),
      Genre.countDocuments({ createdBy: { $exists: true } })
    ]);

    console.log('✅ Verification:');
    console.log(`   - Actors with createdBy: ${counts[0]}`);
    console.log(`   - Directors with createdBy: ${counts[1]}`);
    console.log(`   - Writers with createdBy: ${counts[2]}`);
    console.log(`   - Genres with createdBy: ${counts[3]}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    process.exit(0);
  }
};

// Run migration
console.log('🚀 Starting master data migration...');
migrateMasterData();
