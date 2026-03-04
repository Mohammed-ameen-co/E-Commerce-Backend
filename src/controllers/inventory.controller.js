const inventoryModel = require("../models/inventory.model");
const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");

//This function create new products in inventory schema
async function createInventoryProducts(req, res) {
  const { categoryId, productName, description } = req.body;
  try {
    if (!categoryId || !productName || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await categoryModel.findOne({
      _id: categoryId,
      adminId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Please first create a category before adding products",
      });
    }

    const product = await inventoryModel.create({
      adminId: req.user._id,
      categoryId: category._id,
      productName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Product successfully created",
      product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
}

//It update field in the inventory schema
async function update_product(req, res) {
  try {
    const { productId } = req.params;

    const { productName, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const updateField = {};
    if (productName) {
      updateField.productName = productName.trim();
    }
    if (description) {
      updateField.description = description.trim();
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

    if (Object.keys(updateField).length === 0) {
      return res.status(400).json({
        message: "At least on field required",
      });
    }

    const updateProduct = await inventoryModel.findByIdAndUpdate(
      productId,
      { $set: updateField },
      { new: true, runValidators: true },
    );

    if (!updateProduct) {
      return res.status(404).json({
        message: "Product data not found",
      });
    }

    return res.status(200).json({
      message: "Product updated success",
      product: updateProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at update_product function",
      error: error.message,
    });
  }
}

//And this is get the all invetory schema products
async function getAllInventoryProduct(req, res) {
  try {
    const allProduct = await inventoryModel.find({});

    return res.status(200).json({
      success: true,
      allProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error from get all inventory product",
    });
  }
}

module.exports = {
  createInventoryProducts,
  update_product,
  getAllInventoryProduct,
};
