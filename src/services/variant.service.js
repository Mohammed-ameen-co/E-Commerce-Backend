const variantModel = require("../models/variant.model");
const inventoryModel = require("../models/inventory.model");
const mongoose = require("mongoose");

//This is create new variant
async function createVariantForProducts(data, user) {
  const { productId, productImage, color, size, stock, price } = data;

  if (
    !productId ||
    !productImage ||
    !color ||
    !size ||
    stock === undefined ||
    price === undefined
  ) {
    throw new Error("All fields are required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await inventoryModel.findOne({
    _id: productId,
    adminId: user._id,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const parsedStock = Number(stock);
  const parsedPrice = Number(price);

  if (isNaN(parsedStock) || isNaN(parsedPrice)) {
    throw new Error("Stock and price must be a valid number");
  }

  const variant = await variantModel.create({
    productId: productId,
    adminId: user._id,
    productImage: productImage,
    color: color,
    size: size,
    stock: parsedStock,
    price: parsedPrice,
  });

  return variant;
}

//This function updates a specific variant for a product

async function updateA_Variant(variantId, data, user) {
  const { productImage, color, size, stock, price, status } = data;

  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    throw new Error("invalid variant ID");
  }

  const updateField = {};

  if (productImage) {
    updateField.productImage = productImage;
  }
  if (color) {
    updateField.color = color.trim().toLowerCase();
  }
  if (size) {
    updateField.size = size.trim().toUpperCase();
  }
  if (status) {
    const allowed = ["ACTIVE", INACTIVE];
    const formatted = status.trim().toUpperCase();
    if (!allowed.includes(formatted)) {
      throw new Error("Invalid status value");
    }
    updateField.status = formatted;
  }
  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (isNaN(parsedStock)) {
      throw new Error("Stock must be a valid number");
    }
    updateField.stock = parsedStock;
  }
  if (price !== undefined) {
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      throw new Error("Price must be a valid number");
    }
    updateField.price = parsedPrice;
  }

  if (Object.keys(updateField).length === 0) {
    throw new Error("At least one field is required to update");
  }

  const variant = await variantModel.findByIdAndUpdate(
    variantId,
    {
      $set: updateField,
    },
    { new: true, runValidators: true },
  );

  if (!variant) {
    throw new Error("Variant data not found");
  }

  return variant;
}

module.exports = {
  createVariantForProducts,
  updateA_Variant,
};
