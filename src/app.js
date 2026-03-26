const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const { attachAuthContext } = require("./middlewares/auth.middleware");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachAuthContext);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Grovy backend is running.",
  });
});

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
