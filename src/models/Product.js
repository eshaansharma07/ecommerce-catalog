const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true,
    _id: false
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    variants: {
      type: [variantSchema],
      validate: {
        validator(variants) {
          return variants.length > 0;
        },
        message: 'At least one variant is required.'
      }
    },
    reviews: {
      type: [reviewSchema],
      default: []
    },
    avgRating: {
      type: Number,
      default: null,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ 'variants.sku': 1 }, { unique: true });
productSchema.index({ category: 1, avgRating: -1 });
productSchema.index({ 'variants.stock': 1 });

productSchema.methods.recalculateAverageRating = function recalculateAverageRating() {
  if (!this.reviews.length) {
    this.avgRating = null;
    return this.avgRating;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = totalRating / this.reviews.length;
  this.avgRating = Number(average.toFixed(2));
  return this.avgRating;
};

productSchema.methods.updateVariantStock = function updateVariantStock(sku, quantity, operation = 'inc') {
  const normalizedSku = String(sku).trim().toUpperCase();
  const variant = this.variants.find((item) => item.sku === normalizedSku);

  if (!variant) {
    throw new Error(`Variant with SKU ${normalizedSku} not found.`);
  }

  const nextStock = operation === 'set' ? quantity : variant.stock + quantity;

  if (nextStock < 0) {
    throw new Error('Stock cannot be negative.');
  }

  variant.stock = nextStock;
  return variant;
};

productSchema.statics.getLowStockProducts = async function getLowStockProducts(threshold = 10) {
  const parsedThreshold = Number(threshold);

  return this.aggregate([
    { $unwind: '$variants' },
    { $match: { 'variants.stock': { $lt: parsedThreshold } } },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        category: { $first: '$category' },
        lowStockVariants: {
          $push: {
            sku: '$variants.sku',
            color: '$variants.color',
            price: '$variants.price',
            stock: '$variants.stock'
          }
        }
      }
    },
    { $sort: { name: 1 } }
  ]);
};

productSchema.statics.getCategoryRatings = async function getCategoryRatings() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        avgCategoryRating: { $avg: '$avgRating' }
      }
    },
    {
      $project: {
        _id: 1,
        avgCategoryRating: {
          $cond: [{ $eq: ['$avgCategoryRating', null] }, null, { $round: ['$avgCategoryRating', 2] }]
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
