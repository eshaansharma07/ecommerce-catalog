const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/', productController.createProduct);
router.get('/', productController.listProducts);
router.get('/:id', productController.getProductById);
router.post('/:id/reviews', productController.addReview);
router.patch('/:id/stock', productController.updateStock);

module.exports = router;
