const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");
const upload = require("../utils/multer.util");

router.get(
  "/detail",
  authMiddleware,
  roleMiddleware.isAdmin,
  userController.detail
);
router.get("/profile", authMiddleware, userController.getProfile);
router.post(
  "/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  userController.create
);
router.put(
  "/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  userController.update
);
router.delete(
  "/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  userController.delete
);
router.get(
  "/search",
  authMiddleware,
  roleMiddleware.isAdmin,
  userController.search
);
router.post("/upload_excel", userController.uploadExcel);
router.patch("/update_profile", authMiddleware, userController.updateProfile);

module.exports = router;
