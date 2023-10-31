const express = require("express");
const router = express.Router();
const outboundOrderController = require("../controllers/outbound_order.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  outboundOrderController.create
);
router.get(
  "/detail",
  authMiddleware,
  roleMiddleware.isAdmin,
  outboundOrderController.detail
);
router.post(
  "/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  outboundOrderController.update
);
router.get(
  "/search",
  authMiddleware,
  roleMiddleware.isAdmin,
  outboundOrderController.search
);
router.delete(
  "/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  outboundOrderController.delete
);
router.post(
  "/accept",
  authMiddleware,
  roleMiddleware.isAdmin,
  outboundOrderController.accept
);
module.exports = router;
