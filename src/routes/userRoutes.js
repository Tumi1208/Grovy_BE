const express = require("express");

const { updateCurrentUser } = require("../controllers/userController");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update the current user profile
 *     description: Updates supported profile fields for the authenticated user. Email cannot be changed in this MVP.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           example:
 *             displayName: Nguyen Van A
 *             phone: "+84901234567"
 *             avatarUrl: https://example.com/avatar.png
 *     responses:
 *       200:
 *         description: Profile update result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *             examples:
 *               updated:
 *                 value:
 *                   user:
 *                     id: 681624ab9d4f7a5f0b21d001
 *                     displayName: Nguyen Van A
 *                     name: Nguyen Van A
 *                     email: example123@example.com
 *                     phone: "+84901234567"
 *                     avatarUrl: https://example.com/avatar.png
 *                     role: user
 *                     notificationSettings:
 *                       orderUpdates: true
 *                       promotions: false
 *                       deliveryReminders: true
 *                       restockAlerts: false
 *                     addresses: []
 *                     paymentMethods: []
 *                     createdAt: 2026-05-03T10:00:00.000Z
 *                     updatedAt: 2026-05-03T10:05:00.000Z
 *                   message: Profile updated successfully.
 *               unchanged:
 *                 value:
 *                   user:
 *                     id: 681624ab9d4f7a5f0b21d001
 *                     displayName: Nguyen Van A
 *                     name: Nguyen Van A
 *                     email: example123@example.com
 *                     phone: ""
 *                     avatarUrl: ""
 *                     role: user
 *                     notificationSettings:
 *                       orderUpdates: true
 *                       promotions: false
 *                       deliveryReminders: true
 *                       restockAlerts: false
 *                     addresses: []
 *                     paymentMethods: []
 *                     createdAt: 2026-05-03T10:00:00.000Z
 *                     updatedAt: 2026-05-03T10:00:00.000Z
 *                   message: Nothing changed.
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noChanges:
 *                 value:
 *                   message: No profile changes were provided.
 *               emailChangeNotAllowed:
 *                 value:
 *                   message: Email changes are not available in this MVP yet.
 *       401:
 *         description: Missing or invalid bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Please sign in to continue.
 *       409:
 *         description: Phone number conflict.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: This phone number is already linked to another account.
 *       503:
 *         description: MongoDB is unavailable for user profile flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: MongoDB is not connected. Start the backend with a valid MONGODB_URI.
 */
router.patch("/me", requireAuth, updateCurrentUser);

module.exports = router;
