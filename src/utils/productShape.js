function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeOptionalText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeNonNegativeNumber(value, fallback = 0) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return parsedValue >= 0 ? parsedValue : fallback;
}

function isRemoteUrl(value = "") {
  return /^https?:\/\//i.test(normalizeText(value, ""));
}

function slugifyText(value) {
  return normalizeText(value, "")
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeInternalProduct(product = {}) {
  const normalizedName = normalizeText(product.name, "Unnamed product");
  const fallbackKey =
    slugifyText(product.slug) ||
    slugifyText(product.id) ||
    slugifyText(normalizedName);
  const normalizedId = normalizeText(product.id, fallbackKey);
  const normalizedSlug =
    normalizeText(product.slug, slugifyText(normalizedId)) || fallbackKey;
  const normalizedImageKey = normalizeText(product.imageKey);
  const legacyImageValue = normalizeText(product.image);

  return {
    id: normalizedId,
    name: normalizedName,
    slug: normalizedSlug,
    price: normalizeNonNegativeNumber(product.price),
    category: normalizeText(product.category, "Uncategorized"),
    description: normalizeText(
      product.description,
      "No description available yet."
    ),
    stock: normalizeNonNegativeNumber(product.stock),
    imageKey:
      normalizedImageKey ||
      (legacyImageValue && !isRemoteUrl(legacyImageValue)
        ? legacyImageValue
        : ""),
    ownerId: normalizeOptionalText(product.ownerId),
    shopId: normalizeOptionalText(product.shopId),
  };
}

function isUsableProduct(product = {}) {
  return Boolean(product.id && product.slug && product.name);
}

function normalizeProductCollection(products = []) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  return products
    .map((product) => normalizeInternalProduct(product))
    .filter((product) => {
      if (!isUsableProduct(product)) {
        return false;
      }

      if (seenIds.has(product.id) || seenSlugs.has(product.slug)) {
        return false;
      }

      seenIds.add(product.id);
      seenSlugs.add(product.slug);

      return true;
    });
}

function toPublicProduct(product = {}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    category: product.category,
    description: product.description,
    stock: product.stock,
    imageKey: product.imageKey,
  };
}

module.exports = {
  normalizeInternalProduct,
  normalizeProductCollection,
  toPublicProduct,
};
