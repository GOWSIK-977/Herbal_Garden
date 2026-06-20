const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    size: {
      type: String,
      required: true
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  priceSnapshot: {
    type: Number,
    required: true,
    min: 0
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Calculate total price before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.priceSnapshot * item.quantity);
  }, 0);
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, variant, quantity, price) {
  const existingItem = this.items.find(
    item => item.productId.toString() === productId.toString() && 
             item.variant.size === variant.size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      variant,
      quantity,
      priceSnapshot: price
    });
  }
  
  await this.save();
  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(productId, variantSize) {
  this.items = this.items.filter(
    item => !(item.productId.toString() === productId.toString() && 
              item.variant.size === variantSize)
  );
  await this.save();
  return this;
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function(productId, variantSize, quantity) {
  const item = this.items.find(
    item => item.productId.toString() === productId.toString() && 
             item.variant.size === variantSize
  );
  
  if (!item) throw new Error('Item not found in cart');
  if (quantity <= 0) {
    await this.removeItem(productId, variantSize);
    return this;
  }
  
  item.quantity = quantity;
  await this.save();
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  await this.save();
  return this;
};

module.exports = mongoose.model('Cart', cartSchema);