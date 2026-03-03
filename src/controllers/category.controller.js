const categoryModel = require("../models/category.model");

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

module.exports = {
  createCategory,
};
