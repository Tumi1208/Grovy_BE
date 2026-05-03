const express = require("express");

const {
  getMyOrders,
  getOrderById,
  createOrder,
} = require("../controllers/orderController");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/v1/orders/me:
 *   get:
 *     tags:
 *       - Orders
 *     summary: List my orders
 *     description: Returns orders belonging to the current authenticated user. This endpoint is an alias of `GET /api/v1/orders`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's orders.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       401:
 *         description: Missing or invalid bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Please sign in to continue.
 *       503:
 *         description: MongoDB is unavailable for order flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: MongoDB is not connected. Start the backend with a valid MONGODB_URI.
 */
router.get("/me", getMyOrders);

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: List my orders
 *     description: Returns orders belonging to the current authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's orders.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       401:
 *         description: Missing or invalid bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: MongoDB is unavailable for order flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getMyOrders);

/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get an order by id or order code
 *     description: Returns one order owned by the current authenticated user. The `orderId` can be the generated order code or a MongoDB ObjectId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Serialized order code or MongoDB ObjectId.
 *     responses:
 *       200:
 *         description: Order detail payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Missing or invalid bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order was not found for this account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Order not found for this account.
 *       503:
 *         description: MongoDB is unavailable for order flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:orderId", getOrderById);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create an order
 *     description: Creates a new order for the current authenticated user using the submitted checkout payload.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           example:
 *             customerName: Nguyen Van A
 *             phone: "+84901234567"
 *             address: 123 Le Loi, District 1, HCMC, Vietnam
 *             deliveryAddressSnapshot:
 *               id: null
 *               label: Delivery address
 *               recipientName: Nguyen Van A
 *               phoneNumber: "+84901234567"
 *               addressLine: 123 Le Loi
 *               area: District 1
 *               notes: Call when arriving
 *               fullAddress: 123 Le Loi, District 1, HCMC, Vietnam
 *             paymentMethodSnapshot:
 *               id: null
 *               type: cash
 *               title: Cash on Delivery
 *               meta: ""
 *               label: Cash on Delivery
 *               brand: ""
 *               last4: ""
 *             items:
 *               - productId: apple-gala-1kg
 *                 name: Apple Gala 1kg
 *                 quantity: 2
 *                 price: 3.99
 *             deliveryFee: 1.5
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               id: GRV-260503-0930-123
 *               userId: 681624ab9d4f7a5f0b21d001
 *               ownerId: null
 *               shopId: null
 *               customerName: Nguyen Van A
 *               phone: "+84901234567"
 *               address: 123 Le Loi, District 1, HCMC, Vietnam
 *               items:
 *                 - productId: apple-gala-1kg
 *                   name: Apple Gala 1kg
 *                   quantity: 2
 *                   price: 3.99
 *               itemCount: 2
 *               subtotal: 7.98
 *               deliveryFee: 1.5
 *               totalAmount: 9.48
 *               deliveryAddressSnapshot:
 *                 id: null
 *                 label: Delivery address
 *                 recipientName: Nguyen Van A
 *                 phoneNumber: "+84901234567"
 *                 addressLine: 123 Le Loi
 *                 area: District 1
 *                 notes: Call when arriving
 *                 fullAddress: 123 Le Loi, District 1, HCMC, Vietnam
 *               paymentMethodSnapshot:
 *                 id: null
 *                 type: cash
 *                 title: Cash on Delivery
 *                 meta: ""
 *                 label: Cash on Delivery
 *                 brand: ""
 *                 last4: ""
 *               status: pending
 *               createdAt: 2026-05-03T10:00:00.000Z
 *               updatedAt: 2026-05-03T10:00:00.000Z
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 value:
 *                   message: customerName, phone, and address are required
 *               invalidItems:
 *                 value:
 *                   message: Each item must include productId, name, quantity, and price
 *               missingProduct:
 *                 value:
 *                   message: Each order item must reference an existing product
 *       401:
 *         description: Missing or invalid bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Please sign in to continue.
 *       503:
 *         description: MongoDB is unavailable for order flows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: MongoDB is not connected. Start the backend with a valid MONGODB_URI.
 */
router.post("/", createOrder);

module.exports = router;
