const mongoose = require("mongoose");

const { USER_ROLES } = require("../utils/roles");
const {
  DEFAULT_NOTIFICATION_SETTINGS,
} = require("../utils/userDefaults");

function normalizeOptionalString(value) {
  const trimmedValue = `${value || ""}`.trim();

  return trimmedValue || undefined;
}

const notificationSettingsSchema = new mongoose.Schema(
  {
    orderUpdates: {
      type: Boolean,
      default: DEFAULT_NOTIFICATION_SETTINGS.orderUpdates,
    },
    promotions: {
      type: Boolean,
      default: DEFAULT_NOTIFICATION_SETTINGS.promotions,
    },
    deliveryReminders: {
      type: Boolean,
      default: DEFAULT_NOTIFICATION_SETTINGS.deliveryReminders,
    },
    restockAlerts: {
      type: Boolean,
      default: DEFAULT_NOTIFICATION_SETTINGS.restockAlerts,
    },
  },
  {
    _id: false,
  }
);

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "",
    },
    recipientName: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    addressLine: {
      type: String,
      trim: true,
      default: "",
    },
    area: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    label: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    cardholderName: {
      type: String,
      trim: true,
      default: "",
    },
    last4: {
      type: String,
      trim: true,
      default: "",
    },
    expiry: {
      type: String,
      trim: true,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      set: normalizeOptionalString,
      default: undefined,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    notificationSettings: {
      type: notificationSettingsSchema,
      default: () => ({ ...DEFAULT_NOTIFICATION_SETTINGS }),
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    paymentMethods: {
      type: [paymentMethodSchema],
      default: [],
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
