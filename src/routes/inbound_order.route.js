const express = require("express");
const router = express.Router();
const inboundOrderController = require("../controllers/inbound_order.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  inboundOrderController.create
);
router.get(
  "/detail",
  authMiddleware,
  roleMiddleware.isAdmin,
  inboundOrderController.detail
);
router.post(
  "/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  inboundOrderController.update
);
router.get(
  "/search",
  authMiddleware,
  roleMiddleware.isAdmin,
  inboundOrderController.search
);
router.delete(
  "/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  inboundOrderController.delete
);
router.post(
  "/accept",
  authMiddleware,
  roleMiddleware.isAdmin,
  inboundOrderController.accept
);
module.exports = router;
