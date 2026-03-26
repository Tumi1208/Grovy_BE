const products = require("../data/products");

const getProducts = (req, res) => {
  const { category, ownerId, search, shopId } = req.query;

  let filteredProducts = [...products];

  if (shopId) {
    filteredProducts = filteredProducts.filter((product) => product.shopId === shopId);
  }

  if (ownerId) {
    filteredProducts = filteredProducts.filter((product) => product.ownerId === ownerId);
  }

  if (category) {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.toLowerCase() === category.toLowerCase()
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

  res.status(200).json({
    items: filteredProducts,
    total: filteredProducts.length,
  });
};

const getProductByIdOrSlug = (req, res, next) => {
  const { productIdOrSlug } = req.params;

  const product = products.find(
    (item) => item.id === productIdOrSlug || item.slug === productIdOrSlug
  );

  if (!product) {
    const error = new Error("Product not found");
    res.status(404);
    return next(error);
  }

  return res.status(200).json(product);
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
};
