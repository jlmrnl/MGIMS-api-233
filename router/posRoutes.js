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
      const { products, cash } = req.body;
  
      // Calculate subtotal, itemDiscount, tax, itemCount, and grandTotal based on products
      const subtotal = products.reduce((total, product) => total + product.amount, 0);
      const itemDiscount = 0; // You can calculate item-level discount based on your business logic
      const tax = subtotal * 0.02; // Assuming tax is 2% of the subtotal
      const itemCount = products.length;
      const grandTotal = subtotal - itemDiscount - tax;
      
      // Calculate change based on cash provided by the user
      const change = cash - grandTotal;
  
      // Retrieve the staff ID from the user's session (assuming it's stored as userId)
      const staffId = req.session.userId;
  
      // Create a new invoice with calculated values and the staff ID automatically associated
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
