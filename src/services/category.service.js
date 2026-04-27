const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");

//Create new category
async function createCategory(data, user) {
  const { categoryName, parentCategoryId } = data;

  if (!categoryName) {
    throw new Error("Category name is required");
  }

  let parent = null;
  if (parentCategoryId) {
    parent = await categoryModel.findById(parentCategoryId);
    if (!parent) {
      throw new Error("Parent category not found");
    }
  }
  const normalizedName = categoryName.trim().toLowerCase();
  const isCategoryExists = await categoryModel.findOne({
    categoryName: normalizedName,
    parentCategoryId: parentCategoryId || null,
    adminId: user._id,
  });
  if (isCategoryExists) {
    throw new Error("Category name already exists");
  }
  const category = await categoryModel.create({
    adminId: user._id,
    parentCategoryId: parentCategoryId || null,
    categoryName: normalizedName,
  });
  return category;
}

//This controller update category
async function updateCategory(categoryId, data, user) {
  const { categoryName } = data;

  if (!categoryName) {
    throw new Error("Category name is required");
  }
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category id");
  }
  const normalizedName = categoryName.trim().toLowerCase();
  const category = await categoryModel.findOne({
    _id: categoryId,
    adminId: user._id,
  });

  if (!category) {
    throw new Error("Category data not found");
  }

  const isCategoryExists = await categoryModel.findOne({
    _id: { $ne: categoryId },
    categoryName: normalizedName,
    parentCategoryId: category.parentCategoryId,
    adminId: user._id,
  });
  if (isCategoryExists) {
    throw new Error("Category name already exists");
  }

  category.categoryName = normalizedName;
  await category.save();

  return category;
}

//This controller get All category
async function getAllCategory() {
  const categorys = await categoryModel.find(
    {},
    { adminId: 0, createdAt: 0, updatedAt: 0, __v: 0 },
  );

  const map = {};
  const tree = [];

  categorys.forEach((c) => {
    map[c._id] = { ...c.toObject(), children: [] };
  });

  categorys.forEach((c) => {
    if (c.parentCategoryId) {
      map[c.parentCategoryId]?.children.push(map[c._id]);
    } else {
      tree.push(map[c._id]);
    }
  });

  return tree;
}

module.exports = {
  createCategory,
  updateCategory,
  getAllCategory,
};
