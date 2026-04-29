const mongoose = require("mongoose");

const Order = require("../models/Order");
const { findProductsByIds } = require("../services/productCatalogService");
const ensureDatabaseReady = require("../utils/ensureDatabaseReady");
const {
  roundCurrencyAmount,
  serializeOrder,
} = require("../utils/serializeOrder");

function createOrderCode(date = new Date()) {
  const year = date.getUTCFullYear().toString().slice(-2);
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  const hours = `${date.getUTCHours()}`.padStart(2, "0");
  const minutes = `${date.getUTCMinutes()}`.padStart(2, "0");
  const suffix = Math.floor(Math.random() * 900 + 100);

  return `GRV-${year}${month}${day}-${hours}${minutes}-${suffix}`;
}

function buildAddressSnapshot({
  address,
  customerName,
  deliveryAddressSnapshot,
  phone,
}) {
  if (deliveryAddressSnapshot && typeof deliveryAddressSnapshot === "object") {
    return {
      id: deliveryAddressSnapshot.id || null,
      label: deliveryAddressSnapshot.label || "Delivery address",
      recipientName:
        deliveryAddressSnapshot.recipientName || customerName || "",
      phoneNumber: deliveryAddressSnapshot.phoneNumber || phone || "",
      addressLine: deliveryAddressSnapshot.addressLine || "",
      area: deliveryAddressSnapshot.area || "",
      notes: deliveryAddressSnapshot.notes || "",
      fullAddress:
        deliveryAddressSnapshot.fullAddress || deliveryAddressSnapshot.address || address,
    };
  }

  return {
    id: null,
    label: "Delivery address",
    recipientName: customerName || "",
    phoneNumber: phone || "",
    addressLine: "",
    area: "",
    notes: "",
    fullAddress: address || "",
  };
}

function buildPaymentMethodSnapshot(paymentMethodSnapshot) {
  if (!paymentMethodSnapshot || typeof paymentMethodSnapshot !== "object") {
    return {
      id: null,
      type: "cash",
      title: "Cash on Delivery",
      meta: "",
      label: "Cash on Delivery",
      brand: "",
      last4: "",
    };
  }

  return {
    id: paymentMethodSnapshot.id || null,
    type: paymentMethodSnapshot.type || "cash",
    title: paymentMethodSnapshot.title || "",
    meta: paymentMethodSnapshot.meta || "",
    label: paymentMethodSnapshot.label || "",
    brand: paymentMethodSnapshot.brand || "",
    last4: paymentMethodSnapshot.last4 || "",
  };
}

function findMissingOrderError(next, res) {
  const error = new Error("Order not found for this account.");
  error.statusCode = 404;
  res.status(404);
  return next(error);
}

async function findOwnedOrder(orderId, userId) {
  const filters = [{ orderCode: orderId }];

  if (mongoose.Types.ObjectId.isValid(orderId)) {
    filters.push({ _id: orderId });
  }

  return Order.findOne({
    userId,
    $or: filters,
  });
}

const getMyOrders = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      items: orders.map(serializeOrder),
      total: orders.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const { orderId } = req.params;
    const order = await findOwnedOrder(orderId, req.user._id);

    if (!order) {
      return findMissingOrderError(next, res);
    }

    return res.status(200).json(serializeOrder(order));
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  const {
    customerName,
    phone,
    address,
    deliveryAddressSnapshot,
    paymentMethodSnapshot,
    items,
    deliveryFee = 0,
  } = req.body;

  if (!customerName || !phone || !address) {
    const error = new Error("customerName, phone, and address are required");
    res.status(400);
    return next(error);
  }

  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("items must be a non-empty array");
    res.status(400);
    return next(error);
  }

  const invalidItem = items.find(
    (item) =>
      !item ||
      !item.productId ||
      !item.name ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0 ||
      typeof item.price !== "number" ||
      item.price < 0
  );

  if (invalidItem) {
    const error = new Error(
      "Each item must include productId, name, quantity, and price"
    );
    res.status(400);
    return next(error);
  }

  try {
    ensureDatabaseReady();

    const { items: referencedProducts } = await findProductsByIds(
      items.map((item) => item.productId)
    );
    const productIndex = new Map(
      referencedProducts.map((product) => [product.id, product])
    );
    const firstProduct = productIndex.get(items[0]?.productId) || null;
    const missingProduct = items.find((item) => !productIndex.has(item.productId));

    if (missingProduct) {
      const error = new Error("Each order item must reference an existing product");
      res.status(400);
      return next(error);
    }

    const subtotal = roundCurrencyAmount(
      items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      )
    );
    const normalizedDeliveryFee = roundCurrencyAmount(deliveryFee);
    const totalAmount = roundCurrencyAmount(subtotal + normalizedDeliveryFee);
    const createdAt = new Date();

    const newOrder = await Order.create({
      orderCode: createOrderCode(createdAt),
      userId: req.user._id,
      ownerId: firstProduct?.ownerId || null,
      shopId: firstProduct?.shopId || null,
      customerName: `${customerName}`.trim(),
      phone: `${phone}`.trim(),
      address: `${address}`.trim(),
      items,
      subtotal,
      deliveryFee: normalizedDeliveryFee,
      totalAmount,
      deliveryAddressSnapshot: buildAddressSnapshot({
        address,
        customerName,
        deliveryAddressSnapshot,
        phone,
      }),
      paymentMethodSnapshot: buildPaymentMethodSnapshot(paymentMethodSnapshot),
      createdAt,
      status: "pending",
    });

    return res.status(201).json(serializeOrder(newOrder));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyOrders,
  getOrderById,
  createOrder,
};
