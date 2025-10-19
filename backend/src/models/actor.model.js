import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Actor name is required'],
        trim: true,
        unique: true
    },
    bio: { 
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    photo: { 
        type: String,
        trim: true
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
actorSchema.index({ createdBy: 1 });
actorSchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Unique per user

// Virtual for default photo
actorSchema.virtual('photoUrl').get(function() {
    return this.photo || `https://ui-avatars.com/api/?name=${this.name}&background=random`;
});

const Actor = mongoose.model("Actor", actorSchema);
export default Actor;
