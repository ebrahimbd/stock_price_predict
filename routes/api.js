const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const specs = require('../swagger');

const dataController = require('../controllers/dataController');

// GET /api/input
router.get('/input', dataController.processInput);

// GET /api/
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});
// Serve Swagger UI at /api-docs
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(specs));

module.exports = router;
