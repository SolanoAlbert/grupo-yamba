// Import mongoose to manage MongoDB connections
import mongoose from "mongoose";

// Define an interface that describes the structure of the cache
interface MongooseCache {
  conn: typeof mongoose | null;    // Stores the connection
  promise: Promise<typeof mongoose> | null;  // Stores the connection promise
}

// Extends the global object to include the mongoose variable
declare global {
  var mongoose: MongooseCache | undefined;
}

// Check if the MONGODB_URI environment variable exists
if (!process.env.MONGODB_URI) {
  throw new Error("❌ You must define MONGODB_URI in your .env.local file");
}

// Get the existing cache from the global object
let cached = global.mongoose;

// If the cache doesn't exist, initialize a new one
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Async function to connect to the database
async function dbConnect() {
  // If a connection already exists, return it
  if (cached!.conn) {
    return cached!.conn;
  }

  // If there is no pending connection promise, create a new one
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI as string);
  }

  // Wait for the promise to resolve and store the connection
  cached!.conn = await cached!.promise;
  // Return the connection
  return cached!.conn;
}

// Export the function to be used in other files
export default dbConnect;