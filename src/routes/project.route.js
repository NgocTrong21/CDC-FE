const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  projectController.create
);
router.get(
  "/list",
  authMiddleware,
  roleMiddleware.isAdmin,
  projectController.list
);

module.exports = router;
