const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items', updateCartItem);
router.delete('/items', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;