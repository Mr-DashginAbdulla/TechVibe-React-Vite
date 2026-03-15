const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Check admin role
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin" && req.user.role !== "super-admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

// Optional auth - if token exists, attach user but don't require it
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Token invalid, but that's ok for optional auth
  }
  next();
};

module.exports = { auth, adminAuth, optionalAuth };
