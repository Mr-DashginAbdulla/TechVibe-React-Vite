const express = require("express");
const AuditLog = require("../models/AuditLog");
const { adminAuth } = require("../middleware/auth");
const { getPaginationParams, paginatedResponse } = require("../utils/pagination");
const router = express.Router();

// GET /api/v1/audit-logs - Admin only (paginated, filterable)
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const { adminEmail, action, resource, startDate, endDate, _sort, _order } = req.query;
    const filter = {};

    if (adminEmail) filter.adminEmail = { $regex: adminEmail, $options: "i" };
    if (action) filter.action = action;
    if (resource) filter.resource = resource;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await AuditLog.countDocuments(filter);
    const { page, limit, skip } = getPaginationParams(req.query);

    let sortObj = { createdAt: -1 };
    if (_sort) {
      sortObj = { [_sort]: _order === "asc" ? 1 : -1 };
    }

    const logs = await AuditLog.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json(paginatedResponse(logs, total, page, limit));
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/audit-logs/:id - Single log detail
router.get("/:id", adminAuth, async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: "Audit log not found" });
    }
    res.json(log);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
