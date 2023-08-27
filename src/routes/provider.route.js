const express = require("express");
const router = express.Router();
const providerController = require("../controllers/provider.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post("/create", authMiddleware, roleMiddleware.isAdmin, providerController.create);
router.get("/list", authMiddleware, roleMiddleware.isAdmin, providerController.list);
router.get("/detail", authMiddleware, roleMiddleware.isAdmin, providerController.detail);
router.put("/update", authMiddleware, roleMiddleware.isAdmin, providerController.update);
router.delete("/delete", authMiddleware, roleMiddleware.isAdmin, providerController.delete);
router.get("/search", authMiddleware, roleMiddleware.isAdmin, providerController.search);

module.exports = router;