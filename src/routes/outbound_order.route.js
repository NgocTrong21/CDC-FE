const express = require("express");
const router = express.Router();
const outboundOrderController = require("../controllers/outbound_order.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  outboundOrderController.create
);
router.get(
  "/detail",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  outboundOrderController.detail
);
router.post(
  "/update",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  outboundOrderController.update
);
router.get(
  "/search",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  outboundOrderController.search
);
router.delete(
  "/delete",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  outboundOrderController.delete
);
router.post(
  "/accept",
  authMiddleware,
   permissionMiddleware.CRUD_ORDERS,
  outboundOrderController.accept
);
module.exports = router;
