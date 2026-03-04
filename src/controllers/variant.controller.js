const variantModel = require("../models/variant.model");
const inventoryModel = require("../models/inventory.model");
const mongoose = require("mongoose");

//This is create new variant
async function createVariantForProducts(req, res) {
  const { productId, productImage, color, size, stock, price } = req.body;
  try {
    if (
      !productId ||
      !productImage ||
      !color ||
      !size ||
      stock === undefined ||
      price === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await inventoryModel.findOne({
      _id: productId,
      adminId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const parsedStock = Number(stock);
    const parsedPrice = Number(price);

    if (isNaN(parsedStock) || isNaN(parsedPrice)) {
      return res.status(400).json({
        message: "Stock and price must be a valid number",
      });
    }

    const variant = await variantModel.create({
      productImage: productImage,
      color: color,
      size: size,
      stock: parsedStock,
      price: parsedPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Product successfully created",
      variant,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
}

//And it updates products variants in variant schema

async function updateA_Variant(req, res) {
  try {
    const { variantId } = req.params;
    const { productImage, color, size, stock, price, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({
        message: "Invalid variant ID",
      });
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
        return res.status(400).json({
          message: "Invalid status value",
        });
      }
      updateField.status = formatted;
    }
    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (isNaN(parsedStock)) {
        return res.status(400).json({
          message: "Stock must be a valid number",
        });
      }
      updateField.stock = parsedStock;
    }
    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({
          message: "Price must be a valid number",
        });
      }
      updateField.price = parsedPrice;
    }

    if (Object.keys(updateField).length === 0) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    const variant = await variantModel.findByIdAndUpdate(
      variantId,
      {
        $set: updateField,
      },
      { new: true, runValidators: true },
    );

    if (!variant) {
      return res.status(404).json({
        message: "Variant data not found",
      });
    }

    return res.status(200).json({
      message: "successfully variant updated",
      variant: variant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This variant already exists",
      });
    }
    return res.status(500).json({
      message: "Internal server error in the updateA_Variant function",
      error: error.message,
    });
  }
}

module.exports = {
  createVariantForProducts,
  updateA_Variant,
};
