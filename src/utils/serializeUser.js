const { createNotificationSettings } = require("./userDefaults");

function serializeAddress(address) {
  return {
    id: address?._id?.toString() || null,
    label: address?.label || "",
    recipientName: address?.recipientName || "",
    phoneNumber: address?.phoneNumber || "",
    addressLine: address?.addressLine || "",
    area: address?.area || "",
    notes: address?.notes || "",
    isDefault: Boolean(address?.isDefault),
  };
}

function serializePaymentMethod(paymentMethod) {
  return {
    id: paymentMethod?._id?.toString() || null,
    type: paymentMethod?.type || "cash",
    label: paymentMethod?.label || "",
    description: paymentMethod?.description || "",
    brand: paymentMethod?.brand || "",
    cardholderName: paymentMethod?.cardholderName || "",
    last4: paymentMethod?.last4 || "",
    expiry: paymentMethod?.expiry || "",
    isDefault: Boolean(paymentMethod?.isDefault),
  };
}

function serializeUser(userDocument) {
  const user = userDocument?.toObject ? userDocument.toObject() : userDocument;

  return {
    id: user?._id?.toString() || null,
    displayName: user?.displayName || "",
    name: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || "",
    role: user?.role || "user",
    notificationSettings: createNotificationSettings(
      user?.notificationSettings || {}
    ),
    addresses: Array.isArray(user?.addresses)
      ? user.addresses.map(serializeAddress)
      : [],
    paymentMethods: Array.isArray(user?.paymentMethods)
      ? user.paymentMethods.map(serializePaymentMethod)
      : [],
    createdAt: user?.createdAt || null,
    updatedAt: user?.updatedAt || null,
  };
}

module.exports = {
  serializeUser,
};
