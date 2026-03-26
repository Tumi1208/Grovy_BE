const mongoose = require("mongoose");

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.log("MONGODB_URI is not set. Starting with in-memory API data only.");
    return null;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.warn(
      `MongoDB connection failed. Continuing with in-memory API data only. ${error.message}`
    );
    return null;
  }

  return mongoose.connection;
};

module.exports = connectDB;
