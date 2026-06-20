const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['50g', '100g', '250g', '500g']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    index: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    trim: true
  },
  uses: {
    type: String,
    trim: true
  },
  preparation: {
    type: String,
    trim: true
  },
  precautions: {
    type: String,
    trim: true
  },
  parts: [{
    type: String,
    enum: ['leaves', 'roots', 'bark', 'flowers', 'seeds', 'fruits', 'rhizome', 'bulb', 'whole plant', 'oil', 'pods']
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: 'images/default-herb.jpg'
  },
  variants: [variantSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ 
  name: 'text', 
  scientificName: 'text', 
  description: 'text', 
  uses: 'text',
  tags: 'text'
});

// Method to check stock availability
productSchema.methods.checkStock = function(size, quantity) {
  const variant = this.variants.find(v => v.size === size);
  if (!variant) return false;
  return variant.stock >= quantity;
};

// Method to reduce stock
productSchema.methods.reduceStock = async function(size, quantity) {
  const variant = this.variants.find(v => v.size === size);
  if (!variant) throw new Error('Variant not found');
  if (variant.stock < quantity) throw new Error('Insufficient stock');
  variant.stock -= quantity;
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);