const express = require("express");

const { getHealthStatus } = require("../controllers/healthController");

const router = express.Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Returns backend health details including product source mode and MongoDB connection state.
 *     responses:
 *       200:
 *         description: Health status payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *             example:
 *               status: ok
 *               timestamp: 2026-05-03T10:00:00.000Z
 *               apiMode: mvp
 *               productSourceMode: local
 *               productSource: local-json
 *               orderSource: memory
 *               mongoConfigured: false
 *               mongoState: disconnected
 */
router.get("/", getHealthStatus);

module.exports = router;
