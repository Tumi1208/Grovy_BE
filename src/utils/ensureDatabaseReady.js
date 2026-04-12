const mongoose = require("mongoose");

function ensureDatabaseReady() {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error(
      "MongoDB is not connected. Start the backend with a valid MONGODB_URI."
    );
    error.statusCode = 503;
    throw error;
  }
}

module.exports = ensureDatabaseReady;
