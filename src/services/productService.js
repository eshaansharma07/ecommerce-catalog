const mongoose = require('mongoose');
const Product = require('../models/Product');

async function createProduct(payload) {
  const product = await Product.create(payload);
  return product;
}

async function listProducts() {
  return Product.find().sort({ createdAt: -1 });
}

async function getProductById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product id.');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found.');
  }

  return product;
}

async function addReview(productId, payload) {
  const product = await getProductById(productId);
  product.reviews.push(payload);
  product.recalculateAverageRating();
  await product.save();
  return product;
}

async function updateStock(productId, { sku, quantity, operation }) {
  const product = await getProductById(productId);
  product.updateVariantStock(sku, Number(quantity), operation);
  await product.save();
  return product;
}

async function getLowStockProducts(threshold) {
  return Product.getLowStockProducts(threshold);
}

async function getCategoryRatings() {
  return Product.getCategoryRatings();
}

module.exports = {
  addReview,
  createProduct,
  getCategoryRatings,
  getLowStockProducts,
  getProductById,
  listProducts,
  updateStock
};
