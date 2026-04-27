const inventoryModel = require("../models/inventory.model");
const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");

//This function create new products in inventory schema
async function createInventory(data, user) {
  const {
    categoryId,
    productName,
    description,
    productCoverImage,
    isNewArrival,
    isFeatured,
    isBestSelling,
    isTrending,
  } = data;

  if (!categoryId || !productName || !description) {
    throw new Error("Category ID, product name, and description are required");
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  const category = await categoryModel.findOne({
    _id: categoryId,
    adminId: user._id,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const product = await inventoryModel.create({
    adminId: user._id,
    categoryId: category._id,
    productName,
    description,
    productCoverImage,
    isNewArrival: isNewArrival ?? false,
    isFeatured: isFeatured ?? false,
    isBestSelling: isBestSelling ?? false,
    isTrending: isTrending ?? false,
  });
  return product;
}

//This function update products in inventory schema
async function updateProduct(productId, data) {
  const {
    productName,
    description,
    status,
    isNewArrival,
    isFeatured,
    isBestSelling,
    isTrending,
  } = data;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const updateField = {};
  if (productName) {
    updateField.productName = productName.trim();
  }
  if (description) {
    updateField.description = description.trim();
  }
  if (typeof isNewArrival === "boolean") {
    updateField.isNewArrival = isNewArrival;
  }
  if (typeof isFeatured === "boolean") {
    updateField.isFeatured = isFeatured;
  }
  if (typeof isBestSelling === "boolean") {
    updateField.isBestSelling = isBestSelling;
  }
  if (typeof isTrending === "boolean") {
    updateField.isTrending = isTrending;
  }

  if (status) {
    const allowed = ["ACTIVE", "INACTIVE"];
    const formatted = status.trim().toUpperCase();
    if (!allowed.includes(formatted)) {
      throw new Error("Invalid status value");
    }
    updateField.status = formatted;
  }

  if (Object.keys(updateField).length === 0) {
    throw new Error("At least one field required");
  }

  const updateProduct = await inventoryModel.findByIdAndUpdate(
    productId,
    { $set: updateField },
    { new: true, runValidators: true },
  );

  if (!updateProduct) {
    throw new Error("Product data not found");
  }
  return updateProduct;
}

//This function get all products in inventory schema
async function getProducts(query) {
  const { isNewArrival, isFeatured, isBestSelling, isTrending } = query;

  const filter = {};

  if (isNewArrival) filter.isNewArrival = isNewArrival === "true";
  if (isFeatured) filter.isFeatured = isFeatured === "true";
  if (isBestSelling) filter.isBestSelling = isBestSelling === "true";
  if (isTrending) filter.isTrending = isTrending === "true";

  const allProduct = await inventoryModel.find(
    { ...filter, status: "ACTIVE" },
    { adminId: 0, createdAt: 0, updatedAt: 0 },
  );
  return allProduct;
}
module.exports = {
  createInventory,
  updateProduct,
  getProducts,
};
