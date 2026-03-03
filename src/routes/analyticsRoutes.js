const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/low-stock', analyticsController.lowStock);
router.get('/category-ratings', analyticsController.categoryRatings);

module.exports = router;
