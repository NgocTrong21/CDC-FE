const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/active", authController.active);
router.patch("/change_password", authController.changePassword);

module.exports = router;