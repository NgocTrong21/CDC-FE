const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

// Equipment_Group API
router.post(
  "/group/create",
  authMiddleware,
  permissionMiddleware.GROUP_EQUIPMENT_CREATE,
  categoryController.createGroup
);
router.get(
  "/group/list",
  authMiddleware,
  permissionMiddleware.GROUP_EQUIPMENT_READ,
  categoryController.listGroup
);
router.get(
  "/group/detail",
  authMiddleware,
  permissionMiddleware.GROUP_EQUIPMENT_READ,
  categoryController.detailGroup
);
router.put(
  "/group/update",
  authMiddleware,
  permissionMiddleware.GROUP_EQUIPMENT_UPDATE,
  categoryController.updateGroup
);
router.delete(
  "/group/delete",
  authMiddleware,
  permissionMiddleware.GROUP_EQUIPMENT_DELETE,
  categoryController.deleteGroup
);
router.get(
  "/group/search",
  authMiddleware,
  permissionMiddleware.GROUP_EQUIPMENT_READ,
  categoryController.searchGroup
);

//Equipment_Type API
router.post(
  "/type/create",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_CREATE,
  categoryController.createType
);
router.get(
  "/type/list",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_READ,
  categoryController.listType
);
router.get(
  "/type/list_base_group",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_READ,
  categoryController.listTypeBaseGroupId
);
router.get(
  "/type/detail",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_READ,
  categoryController.detailType
);
router.put(
  "/type/update",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_UPDATE,
  categoryController.updateType
);
router.delete(
  "/type/delete",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_DELETE,
  categoryController.deleteType
);
router.get(
  "/type/search",
  authMiddleware,
  permissionMiddleware.TYPE_EQUIPMENT_READ,
  categoryController.searchType
);

//Equipment_Unit API
router.post(
  "/unit/create",
  authMiddleware,
  permissionMiddleware.UNIT_EQUIPMENT_CREATE,
  categoryController.createUnit
);
router.get(
  "/unit/list",
  authMiddleware,
  permissionMiddleware.UNIT_EQUIPMENT_READ,
  categoryController.listUnit
);
router.get(
  "/unit/detail",
  authMiddleware,
  permissionMiddleware.UNIT_EQUIPMENT_READ,
  categoryController.detailUnit
);
router.put(
  "/unit/update",
  authMiddleware,
  permissionMiddleware.UNIT_EQUIPMENT_UPDATE,
  categoryController.updateUnit
);
router.delete(
  "/unit/delete",
  authMiddleware,
  permissionMiddleware.UNIT_EQUIPMENT_DELETE,
  categoryController.deleteUnit
);
router.get(
  "/unit/search",
  authMiddleware,
  permissionMiddleware.UNIT_EQUIPMENT_READ,
  categoryController.searchUnit
);

//Equipment_Status API
router.post(
  "/status/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.createStatus
);
router.get(
  "/status/list",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.listStatus
);
router.get(
  "/status/detail",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.detailStatus
);
router.put(
  "/status/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.updateStatus
);
router.delete(
  "/status/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.deleteStatus
);
router.get(
  "/status/search",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.searchStatus
);

//Equipment_Risk_Level API
router.post(
  "/risk_level/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.createRiskLevel
);
router.get(
  "/risk_level/list",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.listRiskLevel
);
router.get(
  "/risk_level/detail",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.detailRiskLevel
);
router.put(
  "/risk_level/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.updateRiskLevel
);
router.delete(
  "/risk_level/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.deleteRiskLevel
);
router.get(
  "/risk_level/search",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.searchRiskLevel
);

//Action API

//Repair_Status API
router.post(
  "/repair_status/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  categoryController.createRepairStatus
);
router.get("/repair_status/list", categoryController.listRepairStatus);

//Supply_Type API
router.post("/supplies_type/create", categoryController.createSupllyType);
router.get(
  "/supplies_type/list",
  authMiddleware,
  categoryController.listSupllyType
);
router.get(
  "/supplies_type/detail",
  authMiddleware,
  categoryController.detailSupllyType
);
router.put(
  "/supplies_type/update",
  authMiddleware,
  categoryController.updateSupllyType
);
router.delete(
  "/supplies_type/delete",
  authMiddleware,
  categoryController.deleteSupllyType
);

router.get("/group/list", categoryController.listGroup);
router.get("/group/detail", authMiddleware, categoryController.detailGroup);

router.get("/group/search", authMiddleware, categoryController.searchGroup);

//Equipment_Type API
router.get("/type/list", authMiddleware, categoryController.listType);

router.get("/type/detail", authMiddleware, categoryController.detailType);

router.get("/type/search", authMiddleware, categoryController.searchType);

//Equipment_Unit API
router.get("/unit/list", authMiddleware, categoryController.listUnit);
router.get("/unit/detail", authMiddleware, categoryController.detailUnit);

router.get("/unit/search", authMiddleware, categoryController.searchUnit);

router.get("/status/list", authMiddleware, categoryController.listStatus);
router.get("/status/detail", authMiddleware, categoryController.detailStatus);
router.get("/status/search", authMiddleware, categoryController.searchStatus);

module.exports = router;
