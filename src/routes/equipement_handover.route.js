const express = require("express");
const router = express.Router();
const equipmentHandoverController = require("../controllers/equipment_handover.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/handover",
  authMiddleware,
  roleMiddleware.isAdmin,
  equipmentHandoverController.handoverEquipment
);
router.post(
  "/send_email_handover_report",
  authMiddleware,
  equipmentHandoverController.sendEmailHandoverReport
);
router.get(
  "/list/handover",
  authMiddleware,
  permissionMiddleware.EQUIPMENT_READ,
  equipmentHandoverController.handoverEquipmentList
);
router.get(
  "/handover_info",
  authMiddleware,
  permissionMiddleware.EQUIPMENT_READ,
  equipmentHandoverController.getHandoverInfo
);

module.exports = router;
