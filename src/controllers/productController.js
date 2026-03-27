const {
  findProductByIdOrSlug,
  listProducts,
  toPublicProduct,
} = require("../services/productCatalogService");

const getProducts = async (req, res, next) => {
  try {
    const { items, total } = await listProducts(req.query);

    res.status(200).json({
      items: items.map((product) => toPublicProduct(product)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { productIdOrSlug } = req.params;
    const { item } = await findProductByIdOrSlug(productIdOrSlug);

    if (!item) {
      const error = new Error("Product not found");
      res.status(404);
      return next(error);
    }

    return res.status(200).json(toPublicProduct(item));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
};
