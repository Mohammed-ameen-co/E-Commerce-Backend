const { Router } = require("express");
const inventory = require("../controllers/inventory.controller");
const middleware = require("../middleware/auth.middleware");

const router = Router();

router.post(
  "/add-product",
  middleware.authMiddleware,
  middleware.chackAdmin,
  inventory.createInventoryProducts,
);
router.post(
  "/add-product-new-variant/:productId",
  middleware.authMiddleware,
  middleware.chackAdmin,
  inventory.addNewVariant,
);

router.get("/", inventory.getAllInventoryProduct);
module.exports = router;
