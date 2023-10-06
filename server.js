const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./router/auth");
const productRoutes = require("./router/productRoutes");
const supplierRoutes = require("./router/supplierRoutes");
const staffRoutes = require("./router/staffRoutes");
const staffUser = require("./router/staffUser");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

// Load environment variables from .env file
require("dotenv").config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a secret key for session data encryption
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/supplier", supplierRoutes);
app.use("/staff", staffRoutes);
app.use("/user", staffUser);
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after MongoDB connection is established
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
