const express = require("express");
const router = express.Router();
const equipmentMaintenanceController = require("../controllers/equipment_maintenance.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");

router.get("/list", authMiddleware, permissionMiddleware.MAINTAINANCE_EQUIPMENT_READ, equipmentMaintenanceController.getListMaintenanceEquipment);

module.exports = router;