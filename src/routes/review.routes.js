const { Router } = require("express");
const router = Router();
const review = require("../controllers/review.controller");
const auth = require("../middleware/auth.middleware");

router.post("/give/:orderId/review", auth.authMiddleware, review.createReview);

module.exports = router;
