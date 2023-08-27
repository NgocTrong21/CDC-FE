const express = require("express");
const router = express.Router();
const equipmentTransferController = require("../controllers/equipment_transfer.controller")
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");

router.post("/transfer", authMiddleware, permissionMiddleware.TRANFER_EQUIPMENT_CREATE, equipmentTransferController.transferEquipment);
router.get("/list", authMiddleware, permissionMiddleware.TRANFER_EQUIPMENT_READ, equipmentTransferController.list);
router.post("/approver_transfer", authMiddleware, permissionMiddleware.ACCREDITATION_EQUIPMENT_APPROVE, equipmentTransferController.approverTransfer);
router.get("/detail", authMiddleware, permissionMiddleware.TRANFER_EQUIPMENT_READ, equipmentTransferController.detail);

module.exports = router;