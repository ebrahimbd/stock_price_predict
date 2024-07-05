const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const specs = require('../swagger');

const dataController = require('../controllers/dataController');


router.get('/stock_name', dataController.stock_name);
router.get('/all_stock_name', dataController.all_stock_name);
router.get('/info', dataController.processInput);
router.post('/update_stock', dataController.update_stock);


// GET /api/
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});
// Serve Swagger UI at /api-docs
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(specs));

module.exports = router;
