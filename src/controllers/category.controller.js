const categoryService = require("../services/category.service");

//Create new category
async function createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body, req.user);
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
    const category = await categoryService.updateCategory(categoryId, req.body, req.user);
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
    const tree = await categoryService.getAllCategory();
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
