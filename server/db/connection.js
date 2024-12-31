const mongoose = require('mongoose');
require('dotenv').config()

// Validate environment variables
if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
  console.error('Missing required environment variables (DB_USERNAME or DB_PASSWORD)');
  process.exit(1);
}

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.y0vio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit the process on first failure, let it retry
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.error('Authentication failed. Please check your credentials.');
    }
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect in 5 seconds...');
  setTimeout(connectDB, 5000);
});

// Execute the connection
connectDB();

module.exports = connectDB;




