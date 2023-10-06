const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplierSchema"); // Assuming the correct path to your supplierSchema file

// GET /suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate("productsOffered");
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /suppliers/:id
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate(
      "productsOffered"
    );
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: "uploads/supplier/",
  filename: function (req, file, cb) {
    // Generate a unique filename with a random string and original file extension
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
});

// POST route for adding suppliers
router.post("/add", upload.single("supplierImage"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw new Error("No image uploaded!");
    }

    // Generate a relative path to the uploaded image
    const imagePath = `uploads/supplier/${req.file.filename}`;

    const supplier = new Supplier({
      supplierName: req.body.supplierName,
      business: req.body.business,
      productsOffered: req.body.productsOffered,
      scheduleOfSupply: req.body.scheduleOfSupply,
      image: imagePath, // store the generated relative path
    });

    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /suppliers/:id
router.put("/update/:id", async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /products/:id
router.put(
  "/updateImage/:id",
  upload.single("supplierImage"),
  async (req, res) => {
    try {
      // Check if a new file is uploaded
      let imagePath = null;
      if (req.file) {
        // Generate a relative path to the uploaded image
        imagePath = `uploads/supplier/${req.file.filename}`;
      }

      // Update product information including the image path if a new file is uploaded
      const updatedSupplierData = {
        image: imagePath, // store the generated relative path
      };

      if (imagePath) {
        updatedSupplierData.image = imagePath;
      }

      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        updatedSupplierData,
        { new: true }
      );
      res.json(supplier);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = router;
