const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Admin ID is required"],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category ID is required"],
      index: true,
    },
    productName: {
      type: String,
      required: [true, "Product Title is required"],
      trim: true,
      minlength: [3, "Product Title must be at least 3 characters long"],
      maxlength: [100, "Product Title must be less than 100 characters long"],
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
      trim: true,
      minlength: [
        10,
        "Product Description must be at least 10 characters long",
      ],
      maxlength: [
        1000,
        "Product Description must be less than 1000 characters long",
      ],
    },
    productImage: {
      type: String,
      required: [true, "Product Image URL is required"],
      trim: true,
      match: [
        /^http?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
        "Please use a valid image URL (jpg, jpeg, png, gif, webp)",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
      min: [0, "Product Price must be a positive number"],
    },
    isStockAvailable: {
      type: Boolean,
      default: true,
      required: [true, "Stock availability status is required"],
    },
  },
  { timestamps: true },
);

const inventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = inventoryModel;
