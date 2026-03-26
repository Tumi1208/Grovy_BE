const attachAuthContext = (req, res, next) => {
  if (typeof req.user === "undefined") {
    req.user = null;
  }

  req.auth = {
    isAuthenticated: Boolean(req.user),
    role: req.user?.role || null,
  };

  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    const error = new Error("Authentication is not active in this MVP yet.");
    res.status(501);
    return next(error);
  }

  return next();
};

module.exports = {
  attachAuthContext,
  requireAuth,
};
