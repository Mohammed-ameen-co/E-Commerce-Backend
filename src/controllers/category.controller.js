const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");

//Create new category
async function createCategory(req, res) {
  const { categoryName, parentCategoryId } = req.body;
  try {
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let parent = null;
    if (parentCategoryId) {
      parent = await categoryModel.findById(parentCategoryId);
      if (!parent) {
        return res.status(400).json({ message: "Parent category not found" });
      }
    }
    const normalizedName = categoryName.trim().toLowerCase();
    const isCategoryExists = await categoryModel.findOne({
      categoryName: normalizedName,
      parentCategoryId: parentCategoryId || null,
      adminId: req.user._id,
    });
    if (isCategoryExists) {
      return res.status(409).json({ message: "Category name already exists" });
    }
    const category = await categoryModel.create({
      adminId: req.user._id,
      parentCategoryId: parentCategoryId || null,
      categoryName: normalizedName,
    });
    return res.status(201).json({
      success: true,
      message: "Category successfully created",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
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
    const normalizedName = categoryName.trim().toLowerCase();
    const category = await categoryModel.findOne({
      _id: categoryId,
      adminId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category data not found",
      });
    }

    const isCategoryExists = await categoryModel.findOne({
      _id: { $ne: categoryId },
      categoryName: normalizedName,
      parentCategoryId: category.parentCategoryId,
      adminId: req.user._id,
    });
    if (isCategoryExists) {
      return res.status(409).json({
        message: "Category name already exists",
      });
    }

    category.categoryName = normalizedName;
    await category.save();

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
    const categorys = await categoryModel.find({}, { adminId: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    const map = {};
    const tree = [];

    categorys.forEach((c) => {
      map[c._id] = { ...c, children: [] };
    });

    categorys.forEach((c) => {
      if (c.parentCategoryId) {
        map[c.parentCategoryId]?.children.push(map[c._id]);
      } else {
        tree.push([map[c._id]]);
      }
    });

    return res.status(200).json({
      success: true,
      categorys: tree,
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
