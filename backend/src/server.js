require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const brandRoutes = require("./routes/brands");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const addressRoutes = require("./routes/addresses");
const userRoutes = require("./routes/users");
const promoCodeRoutes = require("./routes/promoCodes");
const statsRoutes = require("./routes/stats");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/promoCodes", promoCodeRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`TechVibe Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
