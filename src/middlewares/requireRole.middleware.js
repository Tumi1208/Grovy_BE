const { isSupportedRole } = require("../utils/roles");

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const hasInvalidRole = allowedRoles.some((role) => !isSupportedRole(role));

    if (hasInvalidRole) {
      const error = new Error("Invalid role configuration.");
      res.status(500);
      return next(error);
    }

    if (!req.user) {
      const error = new Error("Role-based access is not active in this MVP yet.");
      res.status(501);
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error("You do not have access to this resource.");
      res.status(403);
      return next(error);
    }

    return next();
  };
};

module.exports = requireRole;
