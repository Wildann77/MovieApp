import mongoose from "mongoose";

let cached = global.__mongooseConn;
if (!cached) {
    cached = global.__mongooseConn = { conn: null, promise: null };
}

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return mongoose.connection;
        }

        if (!cached.promise) {
            cached.promise = mongoose
                .connect(process.env.MONGODB_URL, { autoIndex: true })
                .then((mongooseInstance) => {
                    console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
                    return mongooseInstance.connection;
                })
                .catch((err) => {
                    cached.promise = null;
                    throw err;
                });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.log("mongoDB connection error:", error);
        throw error;
    }
};
