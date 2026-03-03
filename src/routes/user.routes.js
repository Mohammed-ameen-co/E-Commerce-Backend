const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");
const middleware = require("../middleware/auth.middleware");

router.post("/signup", userController.handleUserRegister);
router.post("/login", userController.handleUserLogin);

router.post("/logout", middleware.authMiddleware, userController.handleLogoutUsers);

router.post("/refresh-token", userController.handleRefreshTokenUsers);

module.exports = router;
