const Order = require('../models/Orders');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { customerDetails, deliveryDate, paymentMethod, items: bodyItems,
            subtotal: bodySubtotal, tax: bodyTax, shippingCost: bodyShipping,
            totalAmount: bodyTotal, fromCart } = req.body;

    let orderItems = [];
    let subtotal = 0;

    // --- Path 1: items provided directly in request body (Buy Now / frontend cart)
    if (bodyItems && Array.isArray(bodyItems) && bodyItems.length > 0) {
      for (const item of bodyItems) {
        orderItems.push({
          productId: item.productId,
          productName: item.productName,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price
        });
        subtotal += item.price * item.quantity;
      }
    }
    // --- Path 2: fall back to MongoDB cart (legacy / API-cart flow)
    else {
      const cart = await Cart.findOne({ userId: req.user.id }).populate({
        path: 'items.productId',
        select: 'name variants'
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      for (const item of cart.items) {
        const product = item.productId;
        const variant = product.variants.find(v => v.size === item.variant.size);
        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variant ${item.variant.size} not found for ${product.name}`
          });
        }
        orderItems.push({
          productId: product._id,
          productName: product.name,
          variant: item.variant,
          quantity: item.quantity,
          price: variant.price
        });
        subtotal += variant.price * item.quantity;
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items to order' });
    }

    const tax          = bodyTax          !== undefined ? bodyTax          : subtotal * 0.05;
    const shippingCost = bodyShipping     !== undefined ? bodyShipping     : 50;
    const totalAmount  = bodyTotal        !== undefined ? bodyTotal        : subtotal + tax + shippingCost;

    const order = await Order.create({
      userId: req.user.id,
      customerDetails,
      items: orderItems,
      deliveryDate,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
    });

    // Optionally reduce stock (best-effort, non-blocking)
    for (const item of orderItems) {
      try {
        const product = await Product.findById(item.productId);
        if (product && typeof product.reduceStock === 'function') {
          await product.reduceStock(item.variant.size, item.quantity);
        }
      } catch (_) { /* stock reduction is optional */ }
    }

    // Clear MongoDB cart if this came from a cart-based checkout
    if (fromCart) {
      try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (cart) await cart.clearCart();
      } catch (_) { /* non-critical */ }
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrder };