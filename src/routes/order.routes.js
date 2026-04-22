const { Router } = require("express");
const router = Router();

const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

router.post(
  "/create/order",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  orderController.createOrders,
);
router.put(
  "/update/:orderId/status",
  auth.authMiddleware,
  auth.chackAdmin,
  orderController.updateOrderStatus,
);
  
router.put(
  "/orders/:orderId/items/:orderItemId/cancel",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  orderController.orderCancellation,
);

module.exports = router;
