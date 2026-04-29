const express = require("express");

const {
  getMyOrders,
  getOrderById,
  createOrder,
} = require("../controllers/orderController");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth);
router.get("/me", getMyOrders);
router.get("/", getMyOrders);
router.get("/:orderId", getOrderById);
router.post("/", createOrder);

module.exports = router;
