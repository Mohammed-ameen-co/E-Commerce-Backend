const { Router } = require("express");
const router = Router();
const cart = require("../controllers/cart.controller");
const preSession = require("../middleware/eSession.middleware");
const optionalAuth = require("../middleware/optional.middleware");

router.post(
  "/add-cart",
  optionalAuth.optionalAuthMiddleware,
  preSession.preUserSessionMiddleware,
  cart.createCart,
);

router.delete(
  "/remove-item/:variantId",
  optionalAuth.optionalAuthMiddleware,
  preSession.preUserSessionMiddleware,
  cart.removeItem,
);
router.delete(
  "/remove-one-item/:variantId",
  optionalAuth.optionalAuthMiddleware,
  preSession.preUserSessionMiddleware,
  cart.removeOneItem,
);

router.get(
  "/get-cart",
  optionalAuth.optionalAuthMiddleware,
  preSession.preUserSessionMiddleware,
  cart.getAllCart,
);

module.exports = router;
