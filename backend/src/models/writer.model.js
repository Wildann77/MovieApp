import mongoose from "mongoose";

const writerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Writer name is required'],
        trim: true,
        unique: true
    },
    bio: { 
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    dateOfBirth: {
        type: Date
    },
    nationality: {
        type: String,
        trim: true
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
writerSchema.index({ createdBy: 1 });
writerSchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Unique per user

const Writer = mongoose.model("Writer", writerSchema);
export default Writer;
