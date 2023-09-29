const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    description: String,
    number_of_stocks: Number,
    price: Number,
    image: String // Store the URL or path to the product image
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
