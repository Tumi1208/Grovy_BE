const express = require("express");

const {
  getProducts,
  getProductByIdOrSlug,
} = require("../controllers/productController");

const router = express.Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products
 *     description: Returns the current public product list from the configured product source.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Exact category match, case-insensitive.
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *         description: Filter by product owner id.
 *       - in: query
 *         name: shopId
 *         schema:
 *           type: string
 *         description: Filter by shop id.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search against product name and description.
 *     responses:
 *       200:
 *         description: Product collection.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             example:
 *               items:
 *                 - id: apple-gala-1kg
 *                   name: Apple Gala 1kg
 *                   slug: apple-gala-1kg
 *                   price: 3.99
 *                   category: Fruits
 *                   description: Fresh Gala apples sold by the kilogram.
 *                   stock: 25
 *                   imageKey: apple-gala-1kg
 *               total: 1
 */
router.get("/", getProducts);

/**
 * @openapi
 * /api/v1/products/{productIdOrSlug}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product detail
 *     description: Looks up a product by its public id or slug.
 *     parameters:
 *       - in: path
 *         name: productIdOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id or slug.
 *     responses:
 *       200:
 *         description: Product detail payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Product not found
 */
router.get("/:productIdOrSlug", getProductByIdOrSlug);

module.exports = router;
