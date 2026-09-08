const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${mongoUri}`);
        return;
      } catch (configuredError) {
        console.warn(`Configured MongoDB unavailable (${configuredError.message}). Falling back to in-memory MongoDB.`);
      }
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB memory server connected: ${uri}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
