const express = require("express");
const router = express.Router();
const Cart = require("../models/cartSchema");

// GET /carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("cart");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by id /cart/:id
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /cart/add
router.post("/add", async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /cart/:id
router.delete("/delete/:id", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndRemove(req.params.id);
    if (cart) {
      res.json({ message: "Cart deleted successfully" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
