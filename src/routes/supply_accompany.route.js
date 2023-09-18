const express = require("express");
const router = express.Router();
const supplyAccompanyController = require("../controllers/supply_accompany.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware.isAdmin,
  supplyAccompanyController.create
);
router.get(
  "/list",
  authMiddleware,
  roleMiddleware.isAdmin,
  supplyAccompanyController.list
);
// router.get(
//   "/detail",
//   authMiddleware,
//   roleMiddleware.isAdmin,
//   supplyAccompanyController.detail
// );
router.put(
  "/update",
  authMiddleware,
  roleMiddleware.isAdmin,
  supplyAccompanyController.update
);
router.delete(
  "/delete",
  authMiddleware,
  roleMiddleware.isAdmin,
  supplyAccompanyController.delete
);

module.exports = router;
