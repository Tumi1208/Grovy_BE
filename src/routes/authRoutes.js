const express = require("express");

const {
  signUp,
  signIn,
  getCurrentUser,
} = require("../controllers/authController");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Create a user account
 *     description: Registers a new user account and returns an access token with the serialized user profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *           example:
 *             displayName: Nguyen Van A
 *             email: example123@example.com
 *             password: password123
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token
 *               user:
 *                 id: 681624ab9d4f7a5f0b21d001
 *                 displayName: Nguyen Van A
 *                 name: Nguyen Van A
 *                 email: example123@example.com
 *                 phone: ""
 *                 avatarUrl: ""
 *                 role: user
 *                 notificationSettings:
 *                   orderUpdates: true
 *                   promotions: false
 *                   deliveryReminders: true
 *                   restockAlerts: false
 *                 addresses: []
 *                 paymentMethods:
 *                   - id: 681624ab9d4f7a5f0b21d003
 *                     type: cash
 *                     label: Cash on Delivery
 *                     description: Pay when your groceries arrive.
 *                     brand: ""
 *                     cardholderName: ""
 *                     last4: ""
 *                     expiry: ""
 *                     isDefault: true
 *                 createdAt: 2026-05-03T10:00:00.000Z
 *                 updatedAt: 2026-05-03T10:00:00.000Z
 *               message: Account created successfully.
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidEmail:
 *                 value:
 *                   message: Please enter a valid email address.
 *       409:
 *         description: Email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: An account with this email already exists.
 *       503:
 *         description: MongoDB is unavailable for auth flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: MongoDB is not connected. Start the backend with a valid MONGODB_URI.
 */
router.post("/signup", signUp);

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in
 *     description: Authenticates a user and returns a JWT access token with the serialized user profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *           example:
 *             email: example123@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Sign-in successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token
 *               user:
 *                 id: 681624ab9d4f7a5f0b21d001
 *                 displayName: Nguyen Van A
 *                 name: Nguyen Van A
 *                 email: example123@example.com
 *                 phone: ""
 *                 avatarUrl: ""
 *                 role: user
 *                 notificationSettings:
 *                   orderUpdates: true
 *                   promotions: false
 *                   deliveryReminders: true
 *                   restockAlerts: false
 *                 addresses: []
 *                 paymentMethods:
 *                   - id: 681624ab9d4f7a5f0b21d003
 *                     type: cash
 *                     label: Cash on Delivery
 *                     description: Pay when your groceries arrive.
 *                     brand: ""
 *                     cardholderName: ""
 *                     last4: ""
 *                     expiry: ""
 *                     isDefault: true
 *                 createdAt: 2026-05-03T10:00:00.000Z
 *                 updatedAt: 2026-05-03T10:00:00.000Z
 *               message: Signed in successfully.
 *       400:
 *         description: Email or password was missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Please enter both email and password.
 *       401:
 *         description: Credentials were invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Email or password is incorrect.
 *       503:
 *         description: MongoDB is unavailable for auth flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: MongoDB is not connected. Start the backend with a valid MONGODB_URI.
 */
router.post("/signin", signIn);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get the current signed-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
 *       401:
 *         description: Missing or invalid bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing:
 *                 value:
 *                   message: Please sign in to continue.
 *               invalid:
 *                 value:
 *                   message: Your session token is invalid. Please sign in again.
 */
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
