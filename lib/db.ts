// importing the mongoose library to interact with the MongoDB database
import mongoose from "mongoose";

// MONGODB_URI is the connection string to the MongoDB database
const MONGODB_URI = process.env.MONGODB_URI!;

// If the MONGODB_URI is not defined, throw an error
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// cached object to store the connection and promise
let cached = global.mongoose;

// If the cached object is not defined, create a new object
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
// If a cached connection exists, return it immediately to prevent multiple connections.
  if (cached.conn) {
    return cached.conn;
  }

// If the promise is not defined, create a new promise to connect to the MongoDB database
  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Disable mongoose buffering
      maxPOOLSIZE: 10, // Maximum number of connections in the connection pool
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
