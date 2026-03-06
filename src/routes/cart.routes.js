const { Router } = require("express");
const router = Router();
const cart = require("../controllers/cart.controller");
const auth = require("../middleware/auth.middleware")

router.post(
  "/add-cart",
  auth.authMiddleware,
  cart.createCart,
);

router.delete(
  "/remove-item/:variantId",
  auth.authMiddleware,
  cart.removeItem,
);
router.delete(
  "/remove-one-item/:variantId",
  auth.authMiddleware,
  cart.removeOneItem,
);

router.get(
  "/get-cart",
  auth.authMiddleware,
  cart.getAllCart,
);

module.exports = router;
