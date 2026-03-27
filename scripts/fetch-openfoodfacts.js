const {
  OPEN_FOOD_FACTS_REFERENCE_FILE_PATH,
  writeOpenFoodFactsReferenceDataset,
} = require("../src/data/productDataset");
const {
  normalizeProductCollection,
  toPublicProduct,
} = require("../src/utils/productShape");

const OPEN_FOOD_FACTS_API_BASE_URL =
  "https://world.openfoodfacts.org/api/v2/product";
const OPEN_FOOD_FACTS_FIELDS = [
  "code",
  "product_name",
  "product_name_en",
  "generic_name",
  "generic_name_en",
  "categories",
  "categories_tags_en",
].join(",");
const OPEN_FOOD_FACTS_USER_AGENT =
  process.env.OPEN_FOOD_FACTS_USER_AGENT ||
  "GrovyStudentMVP/1.0 (student-project@example.com)";

// Keep the list short on purpose so the workflow stays polite to Open Food Facts
// and easy to understand for the Grovy MVP.
const CURATED_OPEN_FOOD_FACTS_BARCODES = [
  "0042400137177",
  "0021130327416",
  "0076808501087",
  "0180411000803",
  "5449000000996",
  "3017624010701",
];

function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function slugifyText(value) {
  return normalizeText(value, "")
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toReadableCategoryLabel(rawTag = "") {
  return normalizeText(rawTag, "")
    .replace(/^[a-z]{2}:/i, "")
    .replace(/-/g, " ");
}

function getCategoryTags(product = {}) {
  return Array.isArray(product.categories_tags_en)
    ? product.categories_tags_en.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];
}

function pickProductName(product = {}, code = "") {
  return (
    normalizeText(product.product_name_en) ||
    normalizeText(product.product_name) ||
    normalizeText(product.generic_name_en) ||
    normalizeText(product.generic_name) ||
    `Open Food Facts Product ${code}`
  );
}

function mapCategory(product = {}) {
  const normalizedTags = getCategoryTags(product).map((tag) => tag.toLowerCase());

  if (normalizedTags.some((tag) => tag.includes("milk"))) {
    return "Dairy";
  }

  if (
    normalizedTags.some(
      (tag) =>
        tag.includes("pasta") ||
        tag.includes("cereal") ||
        tag.includes("spread") ||
        tag.includes("breakfast")
    )
  ) {
    return "Pantry";
  }

  if (
    normalizedTags.some(
      (tag) =>
        tag.includes("juice") ||
        tag.includes("beverage") ||
        tag.includes("soda") ||
        tag.includes("colas") ||
        tag.includes("water")
    )
  ) {
    return "Beverages";
  }

  // TODO: Replace this lightweight mapping if Grovy later adopts a stricter
  // product taxonomy for filtering and analytics.
  return "Groceries";
}

function buildDescription(product = {}) {
  const genericName =
    normalizeText(product.generic_name_en) || normalizeText(product.generic_name);

  if (genericName) {
    return genericName;
  }

  const readableTags = getCategoryTags(product)
    .filter((tag) => !/^[a-z]{2}:/i.test(tag))
    .map(toReadableCategoryLabel)
    .filter((tag) => tag.toLowerCase() !== "other");
  const mostSpecificCategory =
    readableTags[readableTags.length - 1] || readableTags[0] || "";

  if (mostSpecificCategory) {
    return `Imported from Open Food Facts: ${mostSpecificCategory}.`;
  }

  return "Open Food Facts product imported as optional Grovy reference data.";
}

// Open Food Facts does not provide Grovy-ready in-store price or stock values.
// Keep these stable placeholder values until Grovy owns pricing and inventory.
function buildDemoPrice(code = "", index = 0) {
  const numericSeed = Number(code.slice(-3)) || index + 1;

  return Number((1.99 + (numericSeed % 6) * 0.65).toFixed(2));
}

function buildDemoStock(code = "", index = 0) {
  const numericSeed = Number(code.slice(-2)) || index + 1;

  return 12 + (numericSeed % 25);
}

async function fetchOpenFoodFactsProduct(code) {
  const requestUrl = `${OPEN_FOOD_FACTS_API_BASE_URL}/${encodeURIComponent(
    code
  )}?fields=${OPEN_FOOD_FACTS_FIELDS}`;
  const response = await fetch(requestUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": OPEN_FOOD_FACTS_USER_AGENT,
    },
  });
  const rawBody = await response.text();

  if (response.status === 429) {
    throw new Error(
      "Open Food Facts rate limit reached. Wait a minute, then run `npm run fetch:off` again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Open Food Facts request failed for ${code}: ${response.status} ${response.statusText}`
    );
  }

  let data;

  try {
    data = JSON.parse(rawBody);
  } catch {
    throw new Error(`Open Food Facts returned a non-JSON response for ${code}.`);
  }

  if (data?.status !== 1 || !data.product) {
    throw new Error(`Open Food Facts product ${code} was not found.`);
  }

  return data.product;
}

function mapOpenFoodFactsProduct(product = {}, index = 0) {
  const code = normalizeText(product.code);
  const name = pickProductName(product, code);
  const slug = `${slugifyText(name) || "product"}-${code}`;

  return {
    id: code,
    name,
    slug,
    price: buildDemoPrice(code, index),
    category: mapCategory(product),
    description: buildDescription(product),
    stock: buildDemoStock(code, index),
    // Keep OFF imports consistent with the Grovy product shape, but separate
    // from the curated UI demo catalog until someone explicitly remaps them.
    imageKey: slugifyText(name) || slug,
  };
}

async function main() {
  console.log(
    `Fetching ${CURATED_OPEN_FOOD_FACTS_BARCODES.length} optional reference product(s) from Open Food Facts...`
  );

  const mappedProducts = [];

  for (const [index, barcode] of CURATED_OPEN_FOOD_FACTS_BARCODES.entries()) {
    console.log(`- Fetching ${barcode}`);
    const product = await fetchOpenFoodFactsProduct(barcode);
    mappedProducts.push(mapOpenFoodFactsProduct(product, index));
  }

  const normalizedProducts = normalizeProductCollection(mappedProducts).map(
    (product) => toPublicProduct(product)
  );

  if (normalizedProducts.length === 0) {
    throw new Error("No usable products were fetched from Open Food Facts.");
  }

  if (normalizedProducts.length !== mappedProducts.length) {
    console.warn(
      `Some fetched items were dropped during normalization. kept=${normalizedProducts.length} fetched=${mappedProducts.length}`
    );
  }

  writeOpenFoodFactsReferenceDataset(normalizedProducts);

  console.log(
    [
      `Saved ${normalizedProducts.length} product(s) to ${OPEN_FOOD_FACTS_REFERENCE_FILE_PATH}.`,
      "This optional reference file does not power /api/v1/products.",
    ].join(" ")
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
