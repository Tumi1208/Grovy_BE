const mongoose = require("mongoose");

const connectionStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiMode: "mvp",
    productSource: "memory",
    orderSource: "memory",
    mongoConfigured: Boolean(process.env.MONGODB_URI),
    mongoState: connectionStates[mongoose.connection.readyState] || "unknown",
  });
};

module.exports = {
  getHealthStatus,
};
