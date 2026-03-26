const { randomUUID } = require("crypto");

const orders = require("../data/orders");
const products = require("../data/products");

const getOrders = (req, res) => {
  const { customerId, ownerId, shopId, status } = req.query;

  let filteredOrders = [...orders];

  if (customerId) {
    filteredOrders = filteredOrders.filter((order) => order.customerId === customerId);
  }

  if (ownerId) {
    filteredOrders = filteredOrders.filter((order) => order.ownerId === ownerId);
  }

  if (shopId) {
    filteredOrders = filteredOrders.filter((order) => order.shopId === shopId);
  }

  if (status) {
    filteredOrders = filteredOrders.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.status(200).json({
    items: filteredOrders,
    total: filteredOrders.length,
  });
};

const getOrderById = (req, res, next) => {
  const { orderId } = req.params;

  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    const error = new Error("Order not found");
    res.status(404);
    return next(error);
  }

  return res.status(200).json(order);
};

const createOrder = (req, res, next) => {
  const { customerId = null, customerName, phone, address, items, totalAmount, status } =
    req.body;

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

  if (typeof totalAmount !== "number" || totalAmount < 0) {
    const error = new Error("totalAmount must be a valid number");
    res.status(400);
    return next(error);
  }

  const referencedProducts = items.map((item) =>
    products.find((product) => product.id === item.productId)
  );

  if (referencedProducts.some((product) => !product)) {
    const error = new Error("Each order item must reference an existing product");
    res.status(400);
    return next(error);
  }

  const firstProduct = referencedProducts[0];

  const newOrder = {
    id: randomUUID(),
    customerId,
    ownerId: firstProduct?.ownerId || null,
    shopId: firstProduct?.shopId || null,
    customerName,
    phone,
    address,
    items,
    totalAmount,
    createdAt: new Date().toISOString(),
    status: status || "pending",
  };

  orders.push(newOrder);

  return res.status(201).json(newOrder);
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
};
