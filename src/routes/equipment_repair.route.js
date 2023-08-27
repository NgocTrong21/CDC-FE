const express = require("express");
const router = express.Router();
const equipmentRepairController = require("../controllers/equipment_repair.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");

router.get("/equipment_repair_info", authMiddleware, permissionMiddleware.EQUIPMENT_READ, equipmentRepairController.getEquipmentRepair);
router.post("/report", authMiddleware, permissionMiddleware.REPORT_EQUIPMENT_CREATE, equipmentRepairController.reportEquipment);
router.get("/list/broken_and_repair", authMiddleware, permissionMiddleware.EQUIPMENT_READ, equipmentRepairController.getBrokenAndRepairEqList);
router.post("/update_schedule_repair", authMiddleware, permissionMiddleware.REPAIR_EQUIPMENT_UPDATE, equipmentRepairController.updateScheduleRepair);
router.get("/history_repair", authMiddleware, permissionMiddleware.REPAIR_EQUIPMENT_READ, equipmentRepairController.getHistoryRepair);
router.get("/get_repair_schedule", authMiddleware, permissionMiddleware.REPAIR_EQUIPMENT_READ, equipmentRepairController.getRepairSchedule);
router.post("/re_handover", authMiddleware, equipmentRepairController.reHandoverEquipment);

module.exports = router;