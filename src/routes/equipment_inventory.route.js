const express = require("express");
const router = express.Router();
const equipmentInventoryController = require("../controllers/equipment_inventory.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");

router.get(
  "/list_equipments_of_department",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_READ,
  equipmentInventoryController.getListEquipmentsOfDepartment
);
router.post(
  "/create_inventory_notes",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_CREATE,
  equipmentInventoryController.createInventoryNotes
);
router.patch(
  "/approve_inventory_notes",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_APPROVE,
  equipmentInventoryController.approveInventoryNotes
);
router.get(
  "/get_inventory_info",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_READ,
  equipmentInventoryController.getInventoryInfo
);
router.patch(
  "/update_inventory_note",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_UPDATE,
  equipmentInventoryController.updateInventoryNote
);
router.get(
  "/history_inventory_of_department",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_READ,
  equipmentInventoryController.getHistoryInventoryOfDepartment
);
router.get(
  "/history_inventory_of_equipment",
  authMiddleware,
  permissionMiddleware.INVENTORY_EQUIPMENT_READ,
  equipmentInventoryController.getHistoryInventoryOfEquipment
);

module.exports = router;
