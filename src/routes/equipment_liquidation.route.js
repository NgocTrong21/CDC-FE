const express = require("express");
const router = express.Router();
const equipmentLiquidationController = require("../controllers/equipment_liquidation.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");

router.get("/list_unused_equipment", authMiddleware, permissionMiddleware.LIQUIDATION_EQUIPMENT_READ, equipmentLiquidationController.getListUnusedEquipment);
router.post("/create_liquidation_note", authMiddleware, permissionMiddleware.LIQUIDATION_EQUIPMENT_CREATE, equipmentLiquidationController.createLiquidationNote);
router.get("/get_liquidation_detail", authMiddleware, permissionMiddleware.LIQUIDATION_EQUIPMENT_READ, equipmentLiquidationController.getLiquidationDetail);
router.post("/approve_liquidation_note", authMiddleware, permissionMiddleware.LIQUIDATION_EQUIPMENT_APPROVE, equipmentLiquidationController.approveLiquidationNote);

module.exports = router;