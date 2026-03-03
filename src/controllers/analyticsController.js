const productService = require('../services/productService');

async function lowStock(req, res) {
  try {
    const threshold = Number(req.query.threshold || 10);
    const lowStockProducts = await productService.getLowStockProducts(threshold);
    return res.json({ lowStockProducts, threshold });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function categoryRatings(req, res) {
  try {
    const categoryRatings = await productService.getCategoryRatings();
    return res.json({ categoryRatings });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  categoryRatings,
  lowStock
};
