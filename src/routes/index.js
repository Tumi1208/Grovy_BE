const express = require("express");

const healthRoutes = require("./healthRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Grovy API v1 is ready.",
  });
});

router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
