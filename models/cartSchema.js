const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
