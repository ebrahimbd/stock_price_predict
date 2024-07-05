const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
  title: 'Stock Price Prediction API Documentation',
  version: '1.0.0',
  description: 'API documentation for a stock price prediction service',
  },
  servers: [
    {
      url: 'http://localhost:4000', // Replace with your server URL
      description: 'Development server',
    },
  ],
};

// Options for the swagger-jsdoc setup
const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, './swagger.yaml')], // Path to the API routes folder
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
