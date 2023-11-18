const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  permissionMiddleware.CRUD_WAREHOUSES,
  warehouseController.create
);
router.get(
  "/detail",
  authMiddleware,
  permissionMiddleware.CRUD_WAREHOUSES,
  warehouseController.detail
);
router.get(
  "/supplies_by_warehouse",
  authMiddleware,
  permissionMiddleware.CRUD_WAREHOUSES,
  warehouseController.suppliesByWarehouse
);
router.post(
  "/update",
  authMiddleware,
  permissionMiddleware.CRUD_WAREHOUSES,
  warehouseController.update
);
router.get(
  "/search",
  authMiddleware,
  permissionMiddleware.CRUD_WAREHOUSES,
  warehouseController.search
);
router.delete(
  "/delete",
  authMiddleware,
  permissionMiddleware.CRUD_WAREHOUSES,
  warehouseController.delete
);

module.exports = router;
