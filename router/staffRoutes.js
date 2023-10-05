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

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: 'uploads/staff/',
    filename: function (req, file, cb) {
        // Generate a unique filename with a random string and original file extension
        const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
});

const upload = multer({
    storage: storage
});

// POST route for adding products
router.post('/add', upload.single('staffImage'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            throw new Error('No image uploaded!');
        }

        // Generate a relative path to the uploaded image
        const imagePath = `uploads/staff/${req.file.filename}`;

        const newStaffMember = new Staff({
            staffName: req.body.staffName,
            position: req.body.position,
            totalSales: req.body.totalSales,
            shift: req.body.shift,
            contacts: {
              email: req.body.contacts.email,
              phoneNumber: req.body.contacts.phoneNumber
            },
            image: imagePath
          });

        const newStaff = await newStaffMember.save();
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /products/:id
router.put('/update/:id', upload.single('staffImage'), async (req, res) => {
    try {
        // Check if a new file is uploaded
        let imagePath = null;
        if (req.file) {
            // Generate a relative path to the uploaded image
            imagePath = `uploads/staff/${req.file.filename}`;
        }

        // Update product information including the image path if a new file is uploaded
        const updatedStaffData = ({
            staffName: req.body.staffName,
            position: req.body.position,
            totalSales: req.body.totalSales,
            shift: req.body.shift,
            contacts: {
                
              },
            image: imagePath
          });

        if (imagePath) {
            updatedStaffData.image = imagePath;
        }

        const staff = await Staff.findByIdAndUpdate(req.params.id, updatedStaffData, { new: true });
        res.json(staff);
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
router.patch('/patch/:id', getStaffMember, async (req, res) => {
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
  if(req.body.staffImage != null) {
    res.staffMember.staffImage = req/body.shift;
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
