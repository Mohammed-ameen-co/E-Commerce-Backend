const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");

//Create new category
async function createCategory(req, res) {
  const { categoryName } = req.body;
  try {
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const normalizedName = categoryName.trim().toLowerCase();
    const isCategoryExists = await categoryModel.findOne({
      categoryName: normalizedName,
      adminId: req.user._id,
    });
    if (isCategoryExists) {
      return res.status(409).json({ message: "Category name already exists" });
    }
    const category = await categoryModel.create({
      adminId: req.user._id,
      categoryName,
    });
    return res.status(201).json({
      success: true,
      message: "Category successfully created",
      category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
}

//This controller update category
async function updateCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: "Invalid category id",
      });
    }
    const category = await categoryModel.findByIdAndUpdate(
      categoryId,
      { $set: { categoryName } },
      { new: true, runValidators: true },
    );

    if (!category) {
      return res.status(404).json({
        message: "Category data not found",
      });
    }

    return res.status(200).json({
      message: "Category name updated",
      category: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }
    return res.status(500).json({
      message: "Internal server error at update category",
      error: error.message,
    });
  }
}

//This controller get All category
async function getAllCategory(req, res) {
  try {
    const getCategory = await categoryModel.find();

    return res.status(200).json({
      success: true,
      categorys: getCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at get all category",
      error: error.message,
    });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  getAllCategory,
};
