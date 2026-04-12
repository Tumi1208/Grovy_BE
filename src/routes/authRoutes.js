const express = require("express");

const {
  signUp,
  signIn,
  getCurrentUser,
} = require("../controllers/authController");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
