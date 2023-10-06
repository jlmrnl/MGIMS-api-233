const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoiceSchema');
const Staff = require('../models/staffSchema');

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
      const { products, subtotal, itemDiscount, tax, itemCount, grandTotal, cash, change } = req.body;
  
      // Retrieve the staff ID from the user's session (assuming it's stored as userId)
      const staffId = req.session.userId;
  
      // Create a new invoice with the staff ID automatically associated
      const newInvoice = new Invoice({
        products,
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
  


module.exports = router;
