const inventoryModel = require("../models/inventory.model");
const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");
async function createInventoryProducts(req, res) {
  const {
    categoryId,
    productName,
    description,
    productImage,
    color,
    size,
    stock,
    price,
  } = req.body;
  try {
    if (
      !categoryId ||
      !productName ||
      !description ||
      !productImage ||
      !color ||
      !size ||
      stock === undefined ||
      price === undefined
    ) {
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
    const parsedStock = Number(stock);
    const parsedPrice = Number(price);

    if (isNaN(parsedStock) || isNaN(parsedPrice)) {
      return res.status(400).json({
        message: "Stock and price must be a valid number",
      });
    }

    const product = await inventoryModel.create({
      adminId: req.user._id,
      categoryId: category._id,
      productName,
      description,
      variant: [
        {
          productImage: productImage,
          color: color,
          size: size,
          stock: parsedStock,
          price: parsedPrice,
        },
      ],
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

async function addNewVariant(req, res) {
  try {
    const { productId } = req.params;
    const { productImage, color, size, stock, price } = req.body;

    if (
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

    const parsedStock = Number(stock);
    const parsedPrice = Number(price);

    if (isNaN(parsedStock) || isNaN(parsedPrice)) {
      return res.status(400).json({
        message: "Stock and price must be a valid number",
      });
    }

    const product = await inventoryModel.findOne({
      _id: productId,
      adminId: req.user._id,
    });
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    const isExists = product.variant.some(
      (v) => v.color === color && v.size === size,
    );
    if (isExists) {
      return res.status(409).json({
        message: "This variant already exists",
      });
    }

    product.variant.push({
      productImage,
      color: color.trim().toLowerCase(),
      size: size.trim().toUpperCase(),
      stock: parsedStock,
      price: parsedPrice,
    });

    await product.save();

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error from updating variant product",
      error: error.message,
    });
  }
}

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
  getAllInventoryProduct,
  addNewVariant,
};
