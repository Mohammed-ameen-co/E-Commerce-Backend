const {Router} = require("express");
const category = require("../controllers/category.controller");
const middleware = require("../middleware/auth.middleware")

const router = Router();

router.post("/create-category",middleware.authMiddleware, middleware.chackAdmin, category.createCategory);

module.exports = router;