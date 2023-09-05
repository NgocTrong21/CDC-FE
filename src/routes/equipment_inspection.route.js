const express = require("express");
const router = express.Router();
const equipmentInspectionController = require("../controllers/equipment_inspection.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");

router.get(
  "/search",
  authMiddleware,
  permissionMiddleware.ACCREDITATION_EQUIPMENT_READ,
  equipmentInspectionController.getListInspectionEquipment
);
router.put(
  "/inspect_equipment",
  authMiddleware,
  permissionMiddleware.ACCREDITATION_EQUIPMENT_CREATE,
  equipmentInspectionController.inspectEquipment
);
router.get(
  "/detail",
  authMiddleware,
  permissionMiddleware.ACCREDITATION_EQUIPMENT_READ,
  equipmentInspectionController.detailInspection
);
router.patch(
  "/approve_inspection_report",
  authMiddleware,
  permissionMiddleware.ACCREDITATION_EQUIPMENT_APPROVE,
  equipmentInspectionController.approveInspectionReport
);
router.patch(
  "/update_inspection_report",
  authMiddleware,
  permissionMiddleware.ACCREDITATION_EQUIPMENT_UPDATE,
  equipmentInspectionController.updateInspectionReport
);
router.get(
  "/history_inspection",
  authMiddleware,
  permissionMiddleware.ACCREDITATION_EQUIPMENT_READ,
  equipmentInspectionController.getHistoryInspection
);

module.exports = router;
