function roundCurrencyAmount(value) {
  return Number(Number(value || 0).toFixed(2));
}

function serializeOrderItem(item) {
  return {
    productId: item?.productId || "",
    name: item?.name || "",
    quantity: Number(item?.quantity || 0),
    price: roundCurrencyAmount(item?.price),
  };
}

function serializeAddressSnapshot(address) {
  if (!address) {
    return {
      id: null,
      label: "Delivery address",
      recipientName: "",
      phoneNumber: "",
      addressLine: "",
      area: "",
      notes: "",
      fullAddress: "",
    };
  }

  return {
    id: address.id || null,
    label: address.label || "Delivery address",
    recipientName: address.recipientName || "",
    phoneNumber: address.phoneNumber || "",
    addressLine: address.addressLine || "",
    area: address.area || "",
    notes: address.notes || "",
    fullAddress: address.fullAddress || "",
  };
}

function serializePaymentMethodSnapshot(paymentMethod) {
  if (!paymentMethod) {
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
    id: paymentMethod.id || null,
    type: paymentMethod.type || "cash",
    title: paymentMethod.title || "",
    meta: paymentMethod.meta || "",
    label: paymentMethod.label || "",
    brand: paymentMethod.brand || "",
    last4: paymentMethod.last4 || "",
  };
}

function serializeOrder(orderDocument) {
  const order = orderDocument?.toObject ? orderDocument.toObject() : orderDocument;
  const items = Array.isArray(order?.items)
    ? order.items.map(serializeOrderItem)
    : [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal =
    typeof order?.subtotal === "number"
      ? roundCurrencyAmount(order.subtotal)
      : roundCurrencyAmount(
          items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        );
  const deliveryFee = roundCurrencyAmount(order?.deliveryFee);

  return {
    id: order?.orderCode || order?._id?.toString() || "",
    userId: order?.userId?.toString?.() || order?.userId || null,
    ownerId: order?.ownerId || null,
    shopId: order?.shopId || null,
    customerName: order?.customerName || "",
    phone: order?.phone || "",
    address: order?.address || "",
    items,
    itemCount,
    subtotal,
    deliveryFee,
    totalAmount:
      typeof order?.totalAmount === "number"
        ? roundCurrencyAmount(order.totalAmount)
        : roundCurrencyAmount(subtotal + deliveryFee),
    deliveryAddressSnapshot: serializeAddressSnapshot(
      order?.deliveryAddressSnapshot
    ),
    paymentMethodSnapshot: serializePaymentMethodSnapshot(
      order?.paymentMethodSnapshot
    ),
    status: order?.status || "pending",
    createdAt: order?.createdAt || null,
    updatedAt: order?.updatedAt || null,
  };
}

module.exports = {
  roundCurrencyAmount,
  serializeOrder,
};
