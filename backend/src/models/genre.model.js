import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Genre name is required'],
        trim: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
genreSchema.index({ createdBy: 1 });
genreSchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Unique per user

const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
