const express = require("express");

const { updateCurrentUser } = require("../controllers/userController");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.patch("/me", requireAuth, updateCurrentUser);

module.exports = router;
