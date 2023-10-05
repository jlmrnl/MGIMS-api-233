const express = require('express');
const router = express.Router();
const Staff = require('../models/staffSchema'); // Import the Staff model

// Route to get all staff members
router.get('/', async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.json(staffMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new staff member
router.post('/add', async (req, res) => {
  const staffMember = new Staff({
    staffName: req.body.staffName,
    position: req.body.position,
    totalSales: req.body.totalSales,
    shift: req.body.shift,
    contacts: {
      email: req.body.contacts.email,
      phoneNumber: req.body.contacts.phoneNumber
    }
  });

  try {
    const newStaffMember = await staffMember.save();
    res.status(201).json(newStaffMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get a specific staff member by ID
router.get('/:id', getStaffMember, (req, res) => {
  res.json(res.staffMember);
});

// Middleware function to get staff member by ID
async function getStaffMember(req, res, next) {
  let staffMember;
  try {
    staffMember = await Staff.findById(req.params.id);
    if (staffMember == null) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.staffMember = staffMember;
  next();
}

// Route to update a specific staff member by ID
router.patch('/:id', getStaffMember, async (req, res) => {
  if (req.body.staffName != null) {
    res.staffMember.staffName = req.body.staffName;
  }
  if (req.body.position != null) {
    res.staffMember.position = req.body.position;
  }
  if (req.body.totalSales != null) {
    res.staffMember.totalSales = req.body.totalSales;
  }
  if (req.body.shift != null) {
    res.staffMember.shift = req.body.shift;
  }
  if (req.body.contacts != null) {
    res.staffMember.contacts = {
      email: req.body.contacts.email,
      phoneNumber: req.body.contacts.phoneNumber
    };
  }

  try {
    const updatedStaffMember = await res.staffMember.save();
    res.json(updatedStaffMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a specific staff member by ID
router.delete('/:id', getStaffMember, async (req, res) => {
  try {
    await res.staffMember.remove();
    res.json({ message: 'Staff member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
