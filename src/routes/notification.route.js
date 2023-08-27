const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.get("/list", authMiddleware, roleMiddleware.isAdmin, notificationController.list);
router.delete("/delete", authMiddleware, roleMiddleware.isAdmin, notificationController.delete);
router.delete("/delete_all", authMiddleware, roleMiddleware.isAdmin, notificationController.deleteAll);
router.post("/update_is_seen", authMiddleware, roleMiddleware.isAdmin, notificationController.update);

module.exports = router;