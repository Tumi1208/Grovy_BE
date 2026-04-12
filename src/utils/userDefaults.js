const DEFAULT_NOTIFICATION_SETTINGS = Object.freeze({
  orderUpdates: true,
  promotions: false,
  deliveryReminders: true,
  restockAlerts: false,
});

function createNotificationSettings(overrides = {}) {
  return {
    ...DEFAULT_NOTIFICATION_SETTINGS,
    ...overrides,
  };
}

function createStarterPaymentMethods() {
  return [
    {
      type: "cash",
      label: "Cash on Delivery",
      description: "Pay when your groceries arrive.",
      isDefault: true,
    },
  ];
}

module.exports = {
  DEFAULT_NOTIFICATION_SETTINGS,
  createNotificationSettings,
  createStarterPaymentMethods,
};
