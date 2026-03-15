const express = require("express");
const PromoCode = require("../models/PromoCode");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();

// GET /api/promoCodes - Admin only
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const promoCodes = await PromoCode.find();
    res.json(promoCodes);
  } catch (error) {
    next(error);
  }
});

// GET /api/promoCodes/:id - Admin only
router.get("/:id", adminAuth, async (req, res, next) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ error: "Promo code not found" });
    }
    res.json(promoCode);
  } catch (error) {
    next(error);
  }
});

// POST /api/promoCodes - Admin only
router.post("/", adminAuth, async (req, res, next) => {
  try {
    const promoCode = await PromoCode.create(req.body);
    res.status(201).json(promoCode);
  } catch (error) {
    next(error);
  }
});

// POST /api/promoCodes/validate - Public (for checkout)
router.post("/validate", async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promo) {
      return res.status(404).json({ error: "Invalid promo code" });
    }

    if (!promo.isActive) {
      return res.status(400).json({ error: "Promo code is inactive" });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ error: "Promo code has expired" });
    }

    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ error: "Promo code usage limit reached" });
    }

    if (subtotal < promo.minOrder) {
      return res.status(400).json({
        error: "Minimum order amount not met",
        minOrder: promo.minOrder,
      });
    }

    const discountAmount =
      promo.type === "percentage"
        ? (subtotal * promo.discount) / 100
        : promo.discount;

    res.json({
      code: promo.code,
      type: promo.type,
      discount: promo.discount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      description: promo.description,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/promoCodes/:id - Admin only
router.patch("/:id", adminAuth, async (req, res, next) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!promoCode) {
      return res.status(404).json({ error: "Promo code not found" });
    }
    res.json(promoCode);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/promoCodes/:id - Admin only
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ error: "Promo code not found" });
    }
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
