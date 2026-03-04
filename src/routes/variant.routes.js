const { Router } = require("express");
const variants = require("../controllers/variant.controller");
const middleware = require("../middleware/auth.middleware");

const router = Router();


router.post(
  "/create-variant",
  middleware.authMiddleware,
  middleware.chackAdmin,
  variants.createVariantForProducts,
);

router.put(
  "/update-variant/:variantId/variant",
  middleware.authMiddleware,
  middleware.chackAdmin,
  variants.updateA_Variant,
);

module.exports = router;
