const express = require("express");

const {
  getProducts,
  getProductByIdOrSlug,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:productIdOrSlug", getProductByIdOrSlug);

module.exports = router;
