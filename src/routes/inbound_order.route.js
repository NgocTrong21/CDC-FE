const express = require("express");
const router = express.Router();
const inboundOrderController = require("../controllers/inbound_order.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  inboundOrderController.create
);
router.get(
  "/detail",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  inboundOrderController.detail
);
router.post(
  "/update",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  inboundOrderController.update
);
router.get(
  "/search",
  authMiddleware,
  permissionMiddleware.CRUD_ORDERS,
  inboundOrderController.search
);
router.delete(
  "/delete",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  inboundOrderController.delete
);
router.post(
  "/accept",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  inboundOrderController.accept
);
module.exports = router;
