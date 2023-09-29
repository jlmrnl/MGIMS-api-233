const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    description: String,
    number_of_stocks: Number,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
