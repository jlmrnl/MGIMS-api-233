const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/productSchema'); // Import the existing product schema/model

const supplierSchema = new Schema({
    supplierName: {
        type: String,
        required: true
    },
    business: {
        type: String,
        required: true
    },
    productsOffered: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    scheduleOfSupply: {
        type: String,
        default: null
    },
    image: String
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
