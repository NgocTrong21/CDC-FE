const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  warehouseController.create
);
router.get(
  "/detail",
  authMiddleware,
  roleMiddleware.isAdmin,
  warehouseController.detail
);
router.get(
  "/supplies_by_warehouse",
  authMiddleware,
  roleMiddleware.isAdmin,
  warehouseController.suppliesByWarehouse
);
router.post(
  "/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  warehouseController.update
);
router.get(
  "/search",
  authMiddleware,
  roleMiddleware.isAdmin,
  warehouseController.search
);
router.delete(
  "/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  warehouseController.delete
);

module.exports = router;
