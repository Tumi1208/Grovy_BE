const express = require("express");

const healthRoutes = require("./healthRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

/**
 * @openapi
 * /api/v1:
 *   get:
 *     tags:
 *       - System
 *     summary: API v1 status
 *     description: Returns a simple readiness message for the versioned API.
 *     responses:
 *       200:
 *         description: API v1 is reachable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Grovy API v1 is ready.
 */
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Grovy API v1 is ready.",
  });
});

router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
