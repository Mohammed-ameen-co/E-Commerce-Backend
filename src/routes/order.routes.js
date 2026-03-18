const { Router } = require("express");
const router = Router();

const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

router.post(
  "/create-order",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  orderController.createOrders,
);
router.put(
  "/update-order",
  auth.authMiddleware,
  auth.chackAdmin,
  orderController.updateOrderStatus,
);

router.post(
  "/cancelled-order",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  orderController.orderCancellation,
);

module.exports = router;
