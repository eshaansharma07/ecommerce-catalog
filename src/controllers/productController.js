const productService = require('../services/productService');

function handleError(res, error) {
  const status = error.message.includes('not found') ? 404 : 400;
  return res.status(status).json({ error: error.message });
}

async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return handleError(res, error);
  }
}

async function listProducts(req, res) {
  try {
    const products = await productService.listProducts();
    return res.json(products);
  } catch (error) {
    return handleError(res, error);
  }
}

async function getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    return res.json(product);
  } catch (error) {
    return handleError(res, error);
  }
}

async function addReview(req, res) {
  try {
    const product = await productService.addReview(req.params.id, req.body);
    return res.json(product);
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateStock(req, res) {
  try {
    const product = await productService.updateStock(req.params.id, req.body);
    return res.json(product);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  addReview,
  createProduct,
  getProductById,
  listProducts,
  updateStock
};
