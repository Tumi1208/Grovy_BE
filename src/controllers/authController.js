const User = require("../models/User");
const ensureDatabaseReady = require("../utils/ensureDatabaseReady");
const {
  comparePassword,
  hashPassword,
  issueAccessToken,
} = require("../utils/auth");
const { serializeUser } = require("../utils/serializeUser");
const {
  normalizeEmail,
  isValidEmail,
  isValidPassword,
} = require("../utils/validators");
const {
  createNotificationSettings,
  createStarterPaymentMethods,
} = require("../utils/userDefaults");

const INVALID_CREDENTIALS_MESSAGE = "Email or password is incorrect.";

async function signUp(req, res, next) {
  try {
    ensureDatabaseReady();
    const requestBody = req.body || {};

    const displayName = `${requestBody.displayName || ""}`.trim();
    const email = normalizeEmail(requestBody.email);
    const password = `${requestBody.password || ""}`;

    if (!displayName) {
      res.status(400);
      throw new Error("Please enter your full name.");
    }

    if (!email || !isValidEmail(email)) {
      res.status(400);
      throw new Error("Please enter a valid email address.");
    }

    if (!isValidPassword(password)) {
      res.status(400);
      throw new Error("Password must be at least 6 characters.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await hashPassword(password);
    const createdUser = await User.create({
      displayName,
      email,
      passwordHash,
      notificationSettings: createNotificationSettings(),
      paymentMethods: createStarterPaymentMethods(),
    });

    return res.status(201).json({
      token: issueAccessToken(createdUser),
      user: serializeUser(createdUser),
      message: "Account created successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

async function signIn(req, res, next) {
  try {
    ensureDatabaseReady();
    const requestBody = req.body || {};

    const email = normalizeEmail(requestBody.email);
    const password = `${requestBody.password || ""}`;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please enter both email and password.");
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      res.status(401);
      throw new Error(INVALID_CREDENTIALS_MESSAGE);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error(INVALID_CREDENTIALS_MESSAGE);
    }

    return res.status(200).json({
      token: issueAccessToken(user),
      user: serializeUser(user),
      message: "Signed in successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

function getCurrentUser(req, res) {
  return res.status(200).json({
    user: serializeUser(req.user),
  });
}

module.exports = {
  signUp,
  signIn,
  getCurrentUser,
};
