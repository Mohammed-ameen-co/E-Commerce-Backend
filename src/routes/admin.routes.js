const {Router} = require("express");
const router = Router();

const adminController = require("../controllers/admin.controller");

router.post("/create-admin", adminController.handleCreateAdmin);

module.exports = router;