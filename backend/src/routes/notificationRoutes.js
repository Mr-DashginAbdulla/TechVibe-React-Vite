const express = require("express");
const { getNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);

module.exports = router;
