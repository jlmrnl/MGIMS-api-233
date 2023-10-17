const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 0, // Initialize to 0
  },
  totalPrice: {
    type: Number,
    default: 0, // Initialize to 0
  },
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
