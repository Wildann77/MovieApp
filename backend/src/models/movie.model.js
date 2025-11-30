import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: [true, 'Movie title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        year: { 
            type: Number, 
            required: [true, 'Release year is required'],
            min: [1900, 'Year must be after 1900'],
            max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
        },
        duration: { 
            type: String,
            trim: true
        },
        poster: { 
            type: String, 
            required: [true, 'Poster is required'],
            trim: true
        },
        heroImage: { 
            type: String,
            trim: true
        },
        trailer: { 
            type: String,
            trim: true
        },
        gallery: [{ 
            type: String,
            trim: true
        }],
        description: { 
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        director: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Director",
            required: [true, 'Director is required'],
        },
        writers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Writer",
        }],
        cast: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Actor",
        }],
        genres: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre",
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Remove embedded reviews - using separate Review model
        averageRating: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
movieSchema.index({ title: 1 });
movieSchema.index({ year: 1 });
movieSchema.index({ director: 1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ averageRating: -1 });
movieSchema.index({ createdAt: -1 });

// Virtual for movie age
movieSchema.virtual('age').get(function() {
    return new Date().getFullYear() - this.year;
});

// Virtual for formatted duration
movieSchema.virtual('formattedDuration').get(function() {
    if (!this.duration) return null;
    return this.duration;
});

// Virtual to get reviews (populated from Review model)
movieSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'movie'
});

// Method to update rating statistics
movieSchema.methods.updateRatingStats = async function() {
    const Review = mongoose.model('Review');
    const stats = await Review.getAverageRating(this._id);
    this.averageRating = stats.averageRating;
    this.totalReviews = stats.totalReviews;
    await this.save();
};

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
