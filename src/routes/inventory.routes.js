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


router.put(
  "/update-product/:productId",
  middleware.authMiddleware,
  middleware.chackAdmin,
  inventory.update_product,
);

router.get("/", inventory.getAllInventoryProduct);
module.exports = router;
