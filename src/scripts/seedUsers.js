const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

const connectDB = require("../config/database");
const User = require("../models/User");
const { hashPassword } = require("../utils/auth");
const {
  createNotificationSettings,
  createStarterPaymentMethods,
} = require("../utils/userDefaults");

const DEMO_USERS = [
  {
    displayName: "Demo Shopper A",
    email: "demo.a@grovy.app",
    password: "Grovy123",
    phone: "+84 901 111 111",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    notificationSettings: createNotificationSettings({
      promotions: true,
    }),
    addresses: [
      {
        label: "Home",
        recipientName: "Demo Shopper A",
        phoneNumber: "+84 901 111 111",
        addressLine: "12A Riverside Residence",
        area: "District 1, Ho Chi Minh City",
        notes: "Call before arriving.",
        isDefault: true,
      },
    ],
    paymentMethods: createStarterPaymentMethods(),
  },
  {
    displayName: "Demo Shopper B",
    email: "demo.b@grovy.app",
    password: "Grovy456",
    phone: "+84 902 222 222",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    notificationSettings: createNotificationSettings({
      deliveryReminders: false,
      restockAlerts: true,
    }),
    addresses: [
      {
        label: "Studio",
        recipientName: "Demo Shopper B",
        phoneNumber: "+84 902 222 222",
        addressLine: "8 Lotus Tower",
        area: "Binh Thanh District, Ho Chi Minh City",
        notes: "Leave with reception.",
        isDefault: true,
      },
    ],
    paymentMethods: createStarterPaymentMethods(),
  },
];

async function upsertDemoUser(seedUser) {
  const passwordHash = await hashPassword(seedUser.password);
  const payload = {
    displayName: seedUser.displayName,
    email: seedUser.email,
    passwordHash,
    phone: seedUser.phone,
    avatarUrl: seedUser.avatarUrl,
    role: "user",
    notificationSettings: seedUser.notificationSettings,
    addresses: seedUser.addresses,
    paymentMethods: seedUser.paymentMethods,
  };

  const existingUser = await User.findOne({ email: seedUser.email });

  if (existingUser) {
    Object.assign(existingUser, payload);
    await existingUser.save();
    return "updated";
  }

  await User.create(payload);
  return "created";
}

async function run() {
  try {
    await connectDB();

    for (const demoUser of DEMO_USERS) {
      const result = await upsertDemoUser(demoUser);
      console.log(`${result.toUpperCase()}: ${demoUser.email}`);
    }

    console.log("Demo users are ready.");
    process.exit(0);
  } catch (error) {
    console.error(`Failed to seed demo users: ${error.message}`);
    process.exit(1);
  }
}

run();
