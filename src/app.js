const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const apiRoutes = require("./routes");
const { attachAuthContext } = require("./middlewares/auth.middleware");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachAuthContext);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - System
 *     summary: Backend root status
 *     description: Returns a simple status message for the Grovy backend.
 *     responses:
 *       200:
 *         description: Backend is reachable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Grovy backend is running.
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Grovy backend is running.",
  });
});

app.get("/openapi.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
