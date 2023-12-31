const express = require("express");
const router = express.Router();
const Product = require("../models/productSchema");
const Invoice = require("../models/invoiceSchema");

// GET /products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /product/add-to-pos             POINT-OF-SALE POINT-OF-SALE POINT-OF-SALE POINT-OF-SALE POINT-OF-SALE POINT-OF-SALE POINT-OF-SALE
router.post("/add-to-pos", async (req, res) => {
  try {
    const { description, quantity, discount } = req.body;
    const product = await Product.findOne({ description });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const amount = product.price * quantity - discount;

    // Create POS entry
    req.session.pos = req.session.pos || [];
    req.session.pos.push({
      productInfo: product.description,
      quantity,
      discount,
      amount,
    });

    res.json({ message: "Product added to POS" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /products/name/:productName
router.get("/item/:productName", async (req, res) => {
  try {
    const products = await Product.find({
      description: req.params.productName,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    // Generate a unique filename with a random string and original file extension
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
});

// POST route for adding products
router.post("/add", upload.single("productImage"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw new Error("No image uploaded!");
    }

    // Generate a relative path to the uploaded image
    const imagePath = `uploads/${req.file.filename}`;

    const product = new Product({
      description: req.body.description,
      number_of_stocks: req.body.number_of_stocks,
      price: req.body.price,
      image: imagePath, // store the generated relative path
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /products/:id
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /products/:product_id
router.put("/:product_id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.product_id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/decreaseStock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Decrease the stock count by 1 if it's greater than 0 (you can customize this logic)
    if (product.number_of_stocks > 0) {
      product.number_of_stocks -= 1;
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/increaseStock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increase the stock count by 1 (you can customize this logic)
    product.number_of_stocks += 1;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// DELETE /products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
