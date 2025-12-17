import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || "environment";

  if (!uri) {
    console.error("MONGO_URI not set in environment");
    process.exit(1);
  }

  try {
    // Optimized MongoDB connection settings for fast performance
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50, // Increased pool size for better concurrency
      minPoolSize: 5,
      maxIdleTimeMS: 10000,
      compressors: ["zlib"], // Enable compression for network data
      zlibCompressionLevel: 6,
    });
    
    // Enable lean queries globally for better performance
    mongoose.set('strictQuery', false);
    
    console.log(`✓ MongoDB connected to database: "${dbName}"`);
    console.log(`✓ Optimized for fast response with low bandwidth`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;


