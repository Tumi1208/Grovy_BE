const User = require("../models/User");
const ensureDatabaseReady = require("../utils/ensureDatabaseReady");
const { serializeUser } = require("../utils/serializeUser");
const {
  normalizeEmail,
  isValidPhone,
  isValidHttpUrl,
} = require("../utils/validators");

async function updateCurrentUser(req, res, next) {
  try {
    ensureDatabaseReady();
    const requestBody = req.body || {};

    const hasDisplayName = Object.prototype.hasOwnProperty.call(
      requestBody,
      "displayName"
    );
    const hasPhone = Object.prototype.hasOwnProperty.call(requestBody, "phone");
    const hasAvatarUrl = Object.prototype.hasOwnProperty.call(
      requestBody,
      "avatarUrl"
    );
    const hasEmail = Object.prototype.hasOwnProperty.call(requestBody, "email");

    if (!hasDisplayName && !hasPhone && !hasAvatarUrl && !hasEmail) {
      res.status(400);
      throw new Error("No profile changes were provided.");
    }

    if (hasEmail) {
      const nextEmail = normalizeEmail(requestBody.email);

      if (nextEmail !== req.user.email) {
        res.status(400);
        throw new Error("Email changes are not available in this MVP yet.");
      }
    }

    const setOperations = {};
    const unsetOperations = {};

    if (hasDisplayName) {
      const displayName = `${requestBody.displayName || ""}`.trim();

      if (!displayName) {
        res.status(400);
        throw new Error("Display name cannot be empty.");
      }

      setOperations.displayName = displayName;
    }

    if (hasPhone) {
      const phone = `${requestBody.phone || ""}`.trim();

      if (phone && !isValidPhone(phone)) {
        res.status(400);
        throw new Error("Please enter a valid phone number.");
      }

      if (phone) {
        const phoneOwner = await User.findOne({
          _id: { $ne: req.user._id },
          phone,
        });

        if (phoneOwner) {
          res.status(409);
          throw new Error("This phone number is already linked to another account.");
        }

        setOperations.phone = phone;
      } else {
        unsetOperations.phone = 1;
      }
    }

    if (hasAvatarUrl) {
      const avatarUrl = `${requestBody.avatarUrl || ""}`.trim();

      if (avatarUrl && !isValidHttpUrl(avatarUrl)) {
        res.status(400);
        throw new Error("Avatar URL must start with http:// or https://.");
      }

      setOperations.avatarUrl = avatarUrl;
    }

    const updateDocument = {};

    if (Object.keys(setOperations).length > 0) {
      updateDocument.$set = setOperations;
    }

    if (Object.keys(unsetOperations).length > 0) {
      updateDocument.$unset = unsetOperations;
    }

    if (Object.keys(updateDocument).length === 0) {
      return res.status(200).json({
        user: serializeUser(req.user),
        message: "Nothing changed.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateDocument, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      user: serializeUser(updatedUser),
      message: "Profile updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  updateCurrentUser,
};
