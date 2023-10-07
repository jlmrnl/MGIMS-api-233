const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoiceSchema');
const Staff = require('../models/staffSchema');
const Product = require('../models/productSchema');

// GET /pos
router.get('/', (req, res) => {
    const pos = req.session.pos || [];
    res.json(pos);
});

// DELETE /pos/void
router.delete('/void', (req, res) => {
    req.session.pos = [];
    res.json({ message: 'POS voided' });
});

// Route to create a new invoice
router.post('/create-invoice', async (req, res) => {
    try {
        const { products, cash } = req.body;

        // Validate the presence of products array in the request body
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty products array' });
        }

        // Calculate subtotal, itemDiscount, tax, itemCount, and grandTotal based on products
        const subtotal = products.reduce((total, product) => total + product.amount, 0);
        const itemDiscount = 0; // You can calculate item-level discount based on your business logic
        const tax = subtotal * 0.02; // Assuming tax is 2% of the subtotal
        const itemCount = products.length;
        const grandTotal = subtotal - itemDiscount + tax;

        // Calculate change based on cash provided by the user
        const change = cash - grandTotal;

        // Retrieve the staff ID from the user's session (assuming it's stored as userId)
        const staffId = req.session.userId;

        // Update product stock and create a new invoice
        await Promise.all(products.map(async (product) => {
            try {
                // Retrieve the product from the database using the product ID
                const existingProduct = await Product.findById(product.productId);

                // Check if the product exists and has sufficient stock
                if (existingProduct && existingProduct.number_of_stocks >= product.quantity) {
                    // Decrease the product stock
                    existingProduct.number_of_stocks -= product.quantity;
                    await existingProduct.save();
                } else {
                    // If the product does not exist or has insufficient stock, handle the error scenario here
                    // You can choose to return an error response or handle it based on your specific use case
                    throw new Error('Insufficient stock for product: ' + existingProduct.productId);
                }
            } catch (error) {
                // Handle errors related to products (e.g., product not found, insufficient stock)
                console.error('Error updating product:', error);
                throw error; // Rethrow the error to stop processing further
            }
        }));

        // Create a new invoice with calculated values, the staff ID, and product details
        const newInvoice = new Invoice({
            products: products.map(product => ({
                productId: product.productId,
                quantity: product.quantity
            })),
            subtotal,
            itemDiscount,
            tax,
            itemCount,
            grandTotal,
            staff: staffId, // Automatically associate the staff ID
            cash,
            change
        });

        // Save the invoice to the database
        await newInvoice.save();

        res.status(201).json({ message: 'Invoice created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /pos/checkout
router.post('/checkout', async (req, res) => {
    try {
        // Retrieve products and cash from the request body
        const { products, cash } = req.body;

        // Validate the presence of products array in the request body
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty products array' });
        }

        // Calculate subtotal, itemDiscount, tax, itemCount, and grandTotal based on products
        const subtotal = products.reduce((total, product) => total + product.amount, 0);
        const itemDiscount = 0; // You can calculate item-level discount based on your business logic
        const tax = subtotal * 0.02; // Assuming tax is 2% of the subtotal
        const itemCount = products.length;
        const grandTotal = subtotal - itemDiscount + tax;

        // Calculate change based on cash provided by the user
        const change = cash - grandTotal;

        // Retrieve the staff ID from the user's session (assuming it's stored as userId)
        const staffId = req.session.userId;

        // Update product stock and create a new invoice
        await Promise.all(products.map(async (product) => {
            try {
                // Retrieve the product from the database using the product ID
                const existingProduct = await Product.findById(product.productId);

                // Check if the product exists and has sufficient stock
                if (existingProduct && existingProduct.number_of_stocks >= product.quantity) {
                    // Decrease the product stock
                    existingProduct.number_of_stocks -= product.quantity;
                    await existingProduct.save();
                } else {
                    // If the product does not exist or has insufficient stock, handle the error scenario here
                    // You can choose to return an error response or handle it based on your specific use case
                    throw new Error('Insufficient stock for product: ' + existingProduct.productId);
                }
            } catch (error) {
                // Handle errors related to products (e.g., product not found, insufficient stock)
                console.error('Error updating product:', error);
                throw error; // Rethrow the error to stop processing further
            }
        }));

        // Create a new invoice with calculated values, the staff ID, and product details
        const newInvoice = new Invoice({
            products: products.map(product => ({
                productId: product.productId,
                quantity: product.quantity
            })),
            subtotal,
            itemDiscount,
            tax,
            itemCount,
            grandTotal,
            staff: staffId, // Automatically associate the staff ID
            cash,
            change
        });

        // Save the invoice to the database
        await newInvoice.save();

        // Clear the POS session
        req.session.pos = [];

        res.status(201).json({ message: 'Invoice created and checkout successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
