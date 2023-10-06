const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  products: [{
    productInfo: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  itemDiscount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 2
  },
  itemCount: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  cash: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
