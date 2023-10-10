const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
