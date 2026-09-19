
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Print the exact error message from MongoDB/Mongoose
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;