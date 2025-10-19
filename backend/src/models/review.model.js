import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: [true, 'Movie is required'],
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'User is required'],
            index: true
        },
        rating: { 
            type: Number, 
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
            required: [true, 'Rating is required']
        },
        comment: { 
            type: String,
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        isEdited: {
            type: Boolean,
            default: false
        },
        editedAt: {
            type: Date
        },
        isReported: {
            type: Boolean,
            default: false
        },
        reportReason: {
            type: String,
            trim: true
        },
        reportedBy: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            reason: {
                type: String,
                trim: true,
                required: true
            },
            reportedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Compound index to ensure one review per user per movie
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

// Indexes for better query performance
reviewSchema.index({ movie: 1, rating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for like count
reviewSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Pre-save middleware to set edited flag
reviewSchema.pre('save', function(next) {
    if (this.isModified('comment') && !this.isNew) {
        this.isEdited = true;
        this.editedAt = new Date();
    }
    
    // Ensure rating is within valid range
    if (this.rating < 1 || this.rating > 5) {
        return next(new Error('Rating must be between 1 and 5'));
    }
    
    // Ensure comment length is within limit
    if (this.comment && this.comment.length > 500) {
        return next(new Error('Comment cannot exceed 500 characters'));
    }
    
    next();
});

// Static method to get average rating for a movie
reviewSchema.statics.getAverageRating = async function(movieId) {
    const result = await this.aggregate([
        { $match: { movie: movieId } },
        { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
    ]);
    
    return result.length > 0 ? {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        totalReviews: result[0].totalReviews
    } : { averageRating: 0, totalReviews: 0 };
};

const Review = mongoose.model("Review", reviewSchema);
export default Review;
