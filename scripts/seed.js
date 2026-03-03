require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Product = require('../src/models/Product');

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await Product.deleteMany({});

  const products = [
    {
      name: 'Premium Headphones',
      category: 'Electronics',
      variants: [
        { sku: 'HP-BL-001', color: 'Black', price: 199.99, stock: 15 },
        { sku: 'HP-WH-001', color: 'White', price: 209.99, stock: 8 }
      ],
      reviews: [
        {
          userId: new mongoose.Types.ObjectId('65f4a8b7c1e6a8c1f4b8c7d1'),
          rating: 5,
          comment: 'Excellent sound quality'
        }
      ],
      avgRating: 5
    },
    {
      name: 'T-Shirt',
      category: 'Clothing',
      variants: [{ sku: '12345-5', color: 'red', price: 19.99, stock: 5 }],
      reviews: [
        {
          userId: new mongoose.Types.ObjectId(),
          rating: 4,
          comment: 'Comfortable fabric'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          rating: 5,
          comment: 'Great fit'
        }
      ],
      avgRating: 4.5
    },
    {
      name: 'Outdoor Jacket',
      category: 'Clothing',
      variants: [{ sku: '96765-B', color: 'Black', price: 35.99, stock: 2 }],
      reviews: [
        {
          userId: new mongoose.Types.ObjectId(),
          rating: 5,
          comment: 'Warm and durable'
        }
      ],
      avgRating: 5
    },
    {
      name: 'Blender',
      category: 'Appliances',
      variants: [{ sku: 'BLN-100', color: 'Silver', price: 59.99, stock: 30 }],
      reviews: [],
      avgRating: null
    }
  ];

  await Product.insertMany(products);

  console.log('Seed completed with sample catalog data.');
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
