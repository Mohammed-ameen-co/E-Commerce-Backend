function validateUserAddress(req, res, next) {
  const requiredField = [
    "fullname",
    "region",
    "phonenumber",
    "state",
    "zipcode",
    "city",
    "landmark",
    "area",
  ];
  const missingField = requiredField.filter((field) => !req.body[field]);

  if (missingField.length > 0) {
    return res.status(400).json({
      message: `Missing field ${missingField.join(", ")}`,
    });
  }

  next();
}

async function validateUserCart(req, res, next) {
  const { variantId, quantity } = req.body;

  if (!variantId || quantity === undefined) {
    return res.status(400).json({
      message: "Variant Id and quantity is required",
    });
  }

  const parsedQuantity = Number(quantity);

  if (isNaN(parsedQuantity)) {
    return res.status(400).json({
      message: "Quantity must be a valid number",
    });
  }

  if (parsedQuantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be greater then 0",
    });
  }

  req.body.quantity = parsedQuantity;

  next();
}

module.exports = {
  validateUserAddress,
  validateUserCart,
};
