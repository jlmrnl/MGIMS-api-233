const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema');

// GET /products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /products/name/:productName
router.get('/item/:productName', async (req, res) => {
    try {
        const products = await Product.find({ description: req.params.productName });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST /products
const multer = require('multer'); // for handling file uploads
const upload = multer({ dest: 'uploads/' }); // set the destination folder for uploaded files

router.post('/add', upload.single('productImage'), async (req, res) => {
    const product = new Product({
        description: req.body.description,
        number_of_stocks: req.body.number_of_stocks,
        price: req.body.price,
        image: req.file ? req.file.path : null // store the uploaded file path, or null if no file was uploaded
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /products/:id
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /products/:product_id
router.put('/:product_id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.product_id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
