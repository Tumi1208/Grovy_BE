const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

const mongoose = require("mongoose");

const connectDB = require("../config/database");
const Order = require("../models/Order");
const User = require("../models/User");

const DEMO_ORDER_SEEDS = [
  {
    email: "demo.a@grovy.app",
    orders: [
      {
        orderCode: "GRV-260411-1024",
        createdAt: "2026-04-11T10:24:00.000Z",
        status: "On the way",
        customerName: "Demo Shopper A",
        phone: "+84 901 111 111",
        address: "12A Riverside Residence, District 1, Ho Chi Minh City",
        deliveryAddressSnapshot: {
          id: null,
          label: "Home",
          recipientName: "Demo Shopper A",
          phoneNumber: "+84 901 111 111",
          addressLine: "12A Riverside Residence",
          area: "District 1, Ho Chi Minh City",
          notes: "Call before arriving.",
          fullAddress: "12A Riverside Residence, District 1, Ho Chi Minh City",
        },
        paymentMethodSnapshot: {
          id: null,
          type: "cash",
          title: "Cash on Delivery",
          meta: "Pay when your groceries arrive.",
          label: "Cash on Delivery",
          brand: "",
          last4: "",
        },
        items: [
          {
            productId: "grovy-apple-001",
            name: "Apple",
            quantity: 2,
            price: 1.49,
          },
          {
            productId: "grovy-banana-001",
            name: "Banana",
            quantity: 2,
            price: 0.99,
          },
          {
            productId: "grovy-orange-juice-001",
            name: "Orange Juice",
            quantity: 1,
            price: 3.79,
          },
        ],
        subtotal: 8.75,
        deliveryFee: 0,
        totalAmount: 8.75,
      },
      {
        orderCode: "GRV-260409-0915",
        createdAt: "2026-04-09T09:15:00.000Z",
        status: "Processing",
        customerName: "Demo Shopper A",
        phone: "+84 901 111 111",
        address: "12A Riverside Residence, District 1, Ho Chi Minh City",
        deliveryAddressSnapshot: {
          id: null,
          label: "Home",
          recipientName: "Demo Shopper A",
          phoneNumber: "+84 901 111 111",
          addressLine: "12A Riverside Residence",
          area: "District 1, Ho Chi Minh City",
          notes: "Call before arriving.",
          fullAddress: "12A Riverside Residence, District 1, Ho Chi Minh City",
        },
        paymentMethodSnapshot: {
          id: null,
          type: "card",
          title: "Visa ending in 4242",
          meta: "Personal card",
          label: "Personal card",
          brand: "Visa",
          last4: "4242",
        },
        items: [
          {
            productId: "grovy-pasta-001",
            name: "Pasta",
            quantity: 2,
            price: 2.49,
          },
          {
            productId: "grovy-shimla-pepper-001",
            name: "Shimla Pepper",
            quantity: 2,
            price: 1.89,
          },
          {
            productId: "grovy-apple-juice-001",
            name: "Apple Juice",
            quantity: 1,
            price: 2.99,
          },
        ],
        subtotal: 11.75,
        deliveryFee: 0,
        totalAmount: 11.75,
      },
    ],
  },
  {
    email: "demo.b@grovy.app",
    orders: [
      {
        orderCode: "GRV-260322-1840",
        createdAt: "2026-03-22T18:40:00.000Z",
        status: "Delivered",
        customerName: "Demo Shopper B",
        phone: "+84 902 222 222",
        address: "8 Lotus Tower, Binh Thanh District, Ho Chi Minh City",
        deliveryAddressSnapshot: {
          id: null,
          label: "Studio",
          recipientName: "Demo Shopper B",
          phoneNumber: "+84 902 222 222",
          addressLine: "8 Lotus Tower",
          area: "Binh Thanh District, Ho Chi Minh City",
          notes: "Leave with reception.",
          fullAddress: "8 Lotus Tower, Binh Thanh District, Ho Chi Minh City",
        },
        paymentMethodSnapshot: {
          id: null,
          type: "cash",
          title: "Cash on Delivery",
          meta: "Pay when your groceries arrive.",
          label: "Cash on Delivery",
          brand: "",
          last4: "",
        },
        items: [
          {
            productId: "grovy-egg-noodles-001",
            name: "Egg Noodles",
            quantity: 2,
            price: 1.99,
          },
          {
            productId: "grovy-classic-cola-001",
            name: "Classic Cola",
            quantity: 4,
            price: 0.89,
          },
        ],
        subtotal: 7.54,
        deliveryFee: 0,
        totalAmount: 7.54,
      },
      {
        orderCode: "GRV-260214-1548",
        createdAt: "2026-02-14T15:48:00.000Z",
        status: "Cancelled",
        customerName: "Demo Shopper B",
        phone: "+84 902 222 222",
        address: "8 Lotus Tower, Binh Thanh District, Ho Chi Minh City",
        deliveryAddressSnapshot: {
          id: null,
          label: "Studio",
          recipientName: "Demo Shopper B",
          phoneNumber: "+84 902 222 222",
          addressLine: "8 Lotus Tower",
          area: "Binh Thanh District, Ho Chi Minh City",
          notes: "Leave with reception.",
          fullAddress: "8 Lotus Tower, Binh Thanh District, Ho Chi Minh City",
        },
        paymentMethodSnapshot: {
          id: null,
          type: "card",
          title: "Visa ending in 4242",
          meta: "Personal card",
          label: "Personal card",
          brand: "Visa",
          last4: "4242",
        },
        items: [
          {
            productId: "grovy-apple-gala-001",
            name: "Apple Gala",
            quantity: 1,
            price: 1.79,
          },
          {
            productId: "grovy-orange-juice-mini-001",
            name: "Orange Juice Mini",
            quantity: 2,
            price: 1.69,
          },
        ],
        subtotal: 5.17,
        deliveryFee: 0,
        totalAmount: 5.17,
      },
    ],
  },
];

async function upsertSeedOrder(userId, orderSeed) {
  await Order.updateOne(
    { orderCode: orderSeed.orderCode },
    {
      $set: {
        ...orderSeed,
        userId,
      },
    },
    { upsert: true }
  );
}

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required to seed demo orders.");
    }

    await connectDB();

    for (const seedGroup of DEMO_ORDER_SEEDS) {
      const user = await User.findOne({ email: seedGroup.email });

      if (!user) {
        console.warn(`SKIPPED: ${seedGroup.email} (user not found)`);
        continue;
      }

      for (const orderSeed of seedGroup.orders) {
        await upsertSeedOrder(user._id, orderSeed);
        console.log(`UPSERTED: ${seedGroup.email} -> ${orderSeed.orderCode}`);
      }
    }

    console.log("Demo orders are ready.");
    process.exit(0);
  } catch (error) {
    console.error(`Failed to seed demo orders: ${error.message}`);
    process.exit(1);
  }
}

run().finally(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
