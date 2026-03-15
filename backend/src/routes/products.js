const express = require("express");
const Product = require("../models/Product");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/products - Get all products (with optional filters)
router.get("/", async (req, res, next) => {
  try {
    const { category, brand, isFeatured, isNew, _limit, _sort, _order, id_ne } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (isFeatured) filter.isFeatured = isFeatured === "true";
    if (isNew) filter.isNewProduct = isNew === "true";
    if (id_ne) filter._id = { $ne: id_ne };

    let query = Product.find(filter);

    if (_sort) {
      const sortOrder = _order === "desc" ? -1 : 1;
      query = query.sort({ [_sort]: sortOrder });
    }

    if (_limit) {
      query = query.limit(parseInt(_limit));
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Admin only
router.post("/", adminAuth, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data._id) {
      data._id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    }
    if (data.isNew !== undefined) {
      data.isNewProduct = data.isNew;
      delete data.isNew;
    }
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/products/:id - Admin only
router.patch("/:id", adminAuth, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.isNew !== undefined) {
      updates.isNewProduct = updates.isNew;
      delete updates.isNew;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Admin only
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
