# Product Dataset

The curated Grovy UI demo catalog lives in `src/data/products.json`.

Use this product shape:

```json
[
  {
    "id": "grovy-apple-001",
    "name": "Crisp Apple",
    "slug": "crisp-apple",
    "price": 1.29,
    "category": "Fruits",
    "description": "Sweet and crunchy apples for snacks, lunch boxes, and salads.",
    "stock": 34,
    "imageKey": "apple"
  }
]
```

How Grovy uses these files:

- `PRODUCT_DATA_SOURCE=local` reads `src/data/products.json` directly for `/api/v1/products`.
- `npm run products:check` validates and normalizes the same curated file without writing to MongoDB.
- `npm run seed:products` upserts the curated file into MongoDB for later use with `PRODUCT_DATA_SOURCE=auto` or `PRODUCT_DATA_SOURCE=mongo`.
- `npm run fetch:off` writes optional Open Food Facts reference data to `src/data/openFoodFactsProducts.json`. It does not overwrite the curated Grovy demo catalog.

Notes:

- Keep the main demo catalog small, stable, and Grovy-specific.
- Prefer `imageKey` values that map cleanly to frontend local assets.
- Do not use remote image URLs in `src/data/products.json`.
- Open Food Facts is now an optional reference/import utility, not the main UI demo source.
