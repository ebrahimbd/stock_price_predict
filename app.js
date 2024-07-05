const fs = require('fs');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();

require('dotenv').config();
const port = process.env.Port;

// Define the rate limiter
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  max: 500, // limit each IP to 100 requests per windowMs
  message: (req) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return `Too many requests from your IP: ${clientIP} adress, please try again in 24 hours.`;
  }
});

// Apply CORS middleware with specific origin allowed
const allowedOrigins = [process.env.URL2, process.env.URL1]; // Add your allowed origins here
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Apply rate limiter middleware
app.use(limiter);
// Route for API endpoints
app.use('/', require('./routes/api'));

 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

 