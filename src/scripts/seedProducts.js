const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

const mongoose = require("mongoose");

const connectDB = require("../config/database");
const Product = require("../models/Product");
const { LOCAL_PRODUCT_DATA_FILE_PATH } = require("../data/productDataset");
const { getLocalProducts } = require("../services/productCatalogService");

const isDryRun = process.argv.includes("--dry-run");

async function seedProducts() {
  const products = getLocalProducts();

  console.log(
    `Loaded ${products.length} product(s) from ${LOCAL_PRODUCT_DATA_FILE_PATH}`
  );

  if (products.length > 0) {
    console.log(
      `Product ids: ${products.map((product) => product.id).join(", ")}`
    );
  }

  if (products.length === 0) {
    throw new Error("No valid products were found in the local dataset.");
  }

  if (isDryRun) {
    console.log("Dry run complete. No MongoDB writes were made.");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to seed product data into MongoDB.");
  }

  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected.");
  }

  const operations = products.map((product) => ({
    updateOne: {
      filter: { id: product.id },
      update: {
        $set: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          category: product.category,
          description: product.description,
          stock: product.stock,
          imageKey: product.imageKey,
          ownerId: product.ownerId,
          shopId: product.shopId,
        },
        $unset: {
          image: "",
        },
      },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations, { ordered: false });

  console.log(
    [
      `Seed complete for ${products.length} product(s).`,
      `matched=${result.matchedCount}`,
      `modified=${result.modifiedCount}`,
      `upserted=${result.upsertedCount}`,
    ].join(" ")
  );
}

seedProducts()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
