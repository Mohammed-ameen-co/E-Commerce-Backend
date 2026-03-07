const { Router } = require("express");
const router = Router();

const address = require("../controllers/address.controller");
const auth = require("../middleware/auth.middleware");
const valid = require("../middleware/validation.middleware");

router.post(
  "/add-address",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  valid.validateUserAddress,
  address.createUserAddress,
);

router.put(
  "/update-address",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  address.editUserAddress,
);

router.delete(
  "/remove-address",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  address.removeUserAddress,
);

router.get(
  "/get-user-address",
  auth.authMiddleware,
  auth.chackIsEmailVerified,
  address.getAllAddress,
);
module.exports = router;
