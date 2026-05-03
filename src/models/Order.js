const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderAddressSnapshotSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: null,
      trim: true,
    },
    label: {
      type: String,
      default: "",
      trim: true,
    },
    recipientName: {
      type: String,
      default: "",
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },
    addressLine: {
      type: String,
      default: "",
      trim: true,
    },
    area: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    fullAddress: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const orderPaymentMethodSnapshotSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: null,
      trim: true,
    },
    type: {
      type: String,
      default: "cash",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    meta: {
      type: String,
      default: "",
      trim: true,
    },
    label: {
      type: String,
      default: "",
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    last4: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: String,
      default: null,
      trim: true,
    },
    shopId: {
      type: String,
      default: null,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryAddressSnapshot: {
      type: orderAddressSnapshotSchema,
      default: null,
    },
    paymentMethodSnapshot: {
      type: orderPaymentMethodSnapshotSchema,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
