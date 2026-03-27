const mongoose = require("mongoose");

const Product = require("../models/Product");
const { readLocalProductDataset } = require("../data/productDataset");
const {
  normalizeProductCollection,
  toPublicProduct,
} = require("../utils/productShape");

const SUPPORTED_PRODUCT_SOURCES = new Set(["local", "mongo", "auto"]);

function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getConfiguredProductDataSource() {
  const configuredSource = normalizeText(process.env.PRODUCT_DATA_SOURCE, "local").toLowerCase();

  return SUPPORTED_PRODUCT_SOURCES.has(configuredSource) ? configuredSource : "local";
}

function getLocalProducts() {
  return normalizeProductCollection(readLocalProductDataset());
}

async function getMongoProducts() {
  if (mongoose.connection.readyState !== 1) {
    return [];
  }

  const mongoProducts = await Product.find().lean();

  return normalizeProductCollection(mongoProducts);
}

async function getResolvedProductCollection() {
  const configuredSource = getConfiguredProductDataSource();

  if (configuredSource === "local") {
    return {
      items: getLocalProducts(),
      source: "local-json",
    };
  }

  if (configuredSource === "mongo") {
    return {
      items: await getMongoProducts(),
      source: "mongo",
    };
  }

  const mongoProducts = await getMongoProducts();

  if (mongoProducts.length > 0) {
    return {
      items: mongoProducts,
      source: "mongo",
    };
  }

  return {
    items: getLocalProducts(),
    source: "local-json",
  };
}

async function listProducts(filters = {}) {
  const { category, ownerId, search, shopId } = filters;
  const { items, source } = await getResolvedProductCollection();

  let filteredProducts = [...items];

  if (shopId) {
    filteredProducts = filteredProducts.filter((product) => product.shopId === shopId);
  }

  if (ownerId) {
    filteredProducts = filteredProducts.filter((product) => product.ownerId === ownerId);
  }

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const normalizedSearch = search.toLowerCase();

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)
    );
  }

  return {
    items: filteredProducts,
    total: filteredProducts.length,
    source,
  };
}

async function findProductByIdOrSlug(productIdOrSlug) {
  const { items, source } = await getResolvedProductCollection();

  const product = items.find(
    (item) => item.id === productIdOrSlug || item.slug === productIdOrSlug
  );

  return {
    item: product || null,
    source,
  };
}

async function findProductsByIds(productIds = []) {
  const productIdSet = new Set(productIds);
  const { items, source } = await getResolvedProductCollection();

  return {
    items: items.filter((item) => productIdSet.has(item.id)),
    source,
  };
}

async function getResolvedProductSource() {
  const { source } = await getResolvedProductCollection();

  return source;
}

module.exports = {
  findProductByIdOrSlug,
  findProductsByIds,
  getConfiguredProductDataSource,
  getLocalProducts,
  getResolvedProductSource,
  listProducts,
  toPublicProduct,
};
