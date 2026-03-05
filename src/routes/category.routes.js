const { Router } = require("express");
const category = require("../controllers/category.controller");
const middleware = require("../middleware/auth.middleware");

const router = Router();

router.post(
  "/create-category",
  middleware.authMiddleware,
  middleware.chackAdmin,
  category.createCategory,
);

router.put(
  "/update-category/:categoryId",
  middleware.authMiddleware,
  middleware.chackAdmin,
  category.updateCategory,
);

router.get("/get-categorys", category.getAllCategory);

module.exports = router;
