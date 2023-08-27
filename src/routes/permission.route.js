const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post("/create", authMiddleware, roleMiddleware.isAdmin, permissionController.create);
router.post("/create_group", authMiddleware, roleMiddleware.isAdmin, permissionController.createGroup);
router.get("/list", authMiddleware, roleMiddleware.isAdmin, permissionController.list);
router.put("/update_permisison_for_role", authMiddleware, roleMiddleware.isAdmin, permissionController.updatePermissionForRole);

module.exports = router;