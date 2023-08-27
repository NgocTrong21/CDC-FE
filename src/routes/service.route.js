const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post("/create", authMiddleware, roleMiddleware.isAdmin, serviceController.create);
router.get("/list", authMiddleware, roleMiddleware.isAdmin, serviceController.list);

module.exports = router;