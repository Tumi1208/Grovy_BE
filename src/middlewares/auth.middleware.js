const User = require("../models/User");
const { verifyAccessToken } = require("../utils/auth");

const attachAuthContext = (req, res, next) => {
  req.user = null;
  req.authError = null;

  const authorizationHeader = req.headers.authorization || "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    req.auth = {
      isAuthenticated: false,
      role: null,
    };

    return next();
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    req.auth = {
      isAuthenticated: false,
      role: null,
    };
    req.authError = "Your session token is missing. Please sign in again.";
    return next();
  }

  return verifyTokenAndAttachUser(token, req, next);
};

async function verifyTokenAndAttachUser(token, req, next) {
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      req.authError = "Your session is no longer valid. Please sign in again.";
    } else {
      req.user = user;
    }
  } catch (error) {
    req.authError =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please sign in again."
        : "Your session token is invalid. Please sign in again.";
  }

  req.auth = {
    isAuthenticated: Boolean(req.user),
    role: req.user?.role || null,
  };

  return next();
}

const requireAuth = (req, res, next) => {
  if (req.authError) {
    const error = new Error(req.authError);
    res.status(401);
    return next(error);
  }

  if (!req.user) {
    const error = new Error("Please sign in to continue.");
    res.status(401);
    return next(error);
  }

  return next();
};

module.exports = {
  attachAuthContext,
  requireAuth,
};
