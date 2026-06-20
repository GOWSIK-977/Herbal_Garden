const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);

module.exports = router;    