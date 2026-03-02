const { Router } = require("express");
const router = Router();

const emailVerifyController = require("../controllers/emailverify.controller");

router.get("/verify-email/:token", emailVerifyController.sendSignUpEmail);

module.exports = router;
