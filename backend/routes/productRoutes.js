const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProducts,
    getProduct,
    getProductsByTag,
    getFeaturedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/tag/:tag', getProductsByTag);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('variants').isArray().withMessage('Variants must be an array')
], createProduct);

router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, updateStock);

module.exports = router;