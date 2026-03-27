const mongoose = require("mongoose");
const {
  getConfiguredProductDataSource,
  getResolvedProductSource,
} = require("../services/productCatalogService");

const connectionStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const getHealthStatus = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      apiMode: "mvp",
      productSourceMode: getConfiguredProductDataSource(),
      productSource: await getResolvedProductSource(),
      orderSource: "memory",
      mongoConfigured: Boolean(process.env.MONGODB_URI),
      mongoState: connectionStates[mongoose.connection.readyState] || "unknown",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealthStatus,
};
