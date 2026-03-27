const fs = require("fs");
const path = require("path");

const LOCAL_PRODUCT_DATA_FILE_PATH = path.resolve(__dirname, "products.json");
const OPEN_FOOD_FACTS_REFERENCE_FILE_PATH = path.resolve(
  __dirname,
  "openFoodFactsProducts.json"
);

function parseLocalProductFile() {
  const rawFileContents = fs.readFileSync(LOCAL_PRODUCT_DATA_FILE_PATH, "utf8");

  if (!rawFileContents.trim()) {
    return [];
  }

  try {
    const parsedData = JSON.parse(rawFileContents);

    if (Array.isArray(parsedData)) {
      return parsedData;
    }

    if (Array.isArray(parsedData?.products)) {
      return parsedData.products;
    }

    throw new Error(
      'Expected an array of products or an object with a "products" array.'
    );
  } catch (error) {
    error.message = `Could not read ${LOCAL_PRODUCT_DATA_FILE_PATH}. ${error.message}`;
    throw error;
  }
}

function readLocalProductDataset() {
  return parseLocalProductFile();
}

function writeProductDatasetFile(filePath, products = []) {
  fs.writeFileSync(filePath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

function writeLocalProductDataset(products = []) {
  writeProductDatasetFile(LOCAL_PRODUCT_DATA_FILE_PATH, products);
}

function writeOpenFoodFactsReferenceDataset(products = []) {
  writeProductDatasetFile(OPEN_FOOD_FACTS_REFERENCE_FILE_PATH, products);
}

module.exports = {
  LOCAL_PRODUCT_DATA_FILE_PATH,
  OPEN_FOOD_FACTS_REFERENCE_FILE_PATH,
  readLocalProductDataset,
  writeLocalProductDataset,
  writeOpenFoodFactsReferenceDataset,
};
