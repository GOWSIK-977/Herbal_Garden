const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'name imageUrl variants'
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, variant, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if variant exists
    const variantExists = product.variants.find(v => v.size === variant.size);
    if (!variantExists) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }

    // Check stock
    if (!product.checkStock(variant.size, quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Add item to cart
    await cart.addItem(
      productId,
      variant,
      quantity,
      variantExists.price
    );

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'name imageUrl variants'
    });

    res.json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, variantSize, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.updateQuantity(productId, variantSize, quantity);

    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'name imageUrl variants'
    });

    res.json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId, variantSize } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(productId, variantSize);

    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'name imageUrl variants'
    });

    res.json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};