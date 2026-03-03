require('dotenv').config();

const app = require('../src/app');
const connectDB = require('../src/config/db');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB(process.env.MONGODB_URI);
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
