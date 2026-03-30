const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const StockAlert = require("../models/StockAlert");
const Product = require("../models/Product");

// @route   POST /api/v1/stock-alerts
// @desc    Create a new stock alert for a product
// @access  Private
router.post("/", auth, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Məhsul ID-si tələb olunur"
      });
    }

    // Yoxla ki, məhsul mövcuddurmu və həqiqətən stock 0-dırmı
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Məhsul tapılmadı"
      });
    }

    if (product.stock > 0) {
      return res.status(400).json({
        success: false,
        message: "Bu məhsul artıq anbarda mövcuddur"
      });
    }

    // Şəxsin eyni məhsul üçün artıq aktiv olan alertinin olub-olmadığını yoxla
    const existingAlert = await StockAlert.findOne({
      userId: req.user.id,
      productId,
      notified: false
    });

    if (existingAlert) {
      return res.status(400).json({
        success: false,
        message: "Siz artıq bu məhsul üçün bildiriş aktiv etmisiniz"
      });
    }

    const alert = await StockAlert.create({
      userId: req.user.id,
      email: req.user.email,
      productId
    });

    res.status(201).json({
      success: true,
      data: alert,
      message: "Məhsul gəldiyində sizə bildiriş göndəriləcək"
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/stock-alerts
// @desc    Get user's active stock alerts
// @access  Private
router.get("/", auth, async (req, res, next) => {
  try {
    const alerts = await StockAlert.find({
      userId: req.user.id,
      notified: false
    }).populate("productId", "name mainImage price slug");

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/v1/stock-alerts/:id
// @desc    Remove a stock alert
// @access  Private
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const alert = await StockAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Bildiriş tapılmadı"
      });
    }

    if (alert.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Bu əməliyyat üçün icazəniz yoxdur"
      });
    }

    await alert.deleteOne();

    res.status(200).json({
      success: true,
      message: "Bildiriş ləğv edildi"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
