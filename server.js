// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorMiddleware');
const accountRouter = require('./controllers/accountController');
const userRouter = require('./controllers/userController');
const transactionRouter = require('./controllers/transactionController');
const http = require('http'); // Ensure this is included if you're using it for the server

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Use the FRONTEND_URL from .env file
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS with your options
app.use(cors(corsOptions)); // Apply  CORS policy

// Middleware setup
app.use(helmet());
app.use(bodyParser.json());

// Rate limiting setup to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Define routes using the imported routers
app.use('/account', accountRouter);
app.use('/users', userRouter);
app.use('/transactions', transactionRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Apply the custom error handling middleware
app.use(errorHandler);

// Network configuration
const PORT = process.env.PORT || 5000;
http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
