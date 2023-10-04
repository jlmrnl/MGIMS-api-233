const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./router/auth");
const productRoutes = require("./router/productRoutes");
const supplierRoutes = require("./router/supplierRoutes");
const cors = require("cors");

const app = express();

// Load environment variables from .env file
require("dotenv").config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/supplier", supplierRoutes)
app.use("/uploads", express.static("uploads"));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});