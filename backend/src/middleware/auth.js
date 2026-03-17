const User = require("../models/User");
const firebaseAdmin = require("../config/firebase-admin");

// Verify Firebase ID Token
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Verify with Firebase
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    // Fetch MongoDB User profile
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ error: "User not found in system" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired Firebase token" });
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
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
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
