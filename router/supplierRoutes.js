const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplierSchema'); // Assuming the correct path to your supplierSchema file

// GET /suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('productsOffered');
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /suppliers/:id
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id).populate('productsOffered');
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /suppliers
router.post('/add', async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /suppliers/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /suppliers/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndRemove(req.params.id);
        if (deletedSupplier) {
            res.json({ message: 'Supplier deleted successfully' });
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
