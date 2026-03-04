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
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: [true, "Product status is required"],
      default: "ACTIVE",
      index: true,
      uppercase: true,
    },
  },
  { timestamps: true },
);

inventorySchema.index(
  {
    productName: "text",
    description: "text",
  },
  { weight: { productName: 10, description: 7 } },
);

inventorySchema.index(
  {
    categoryId: 1,
    productName: 1,
  },
  { unique: true },
);

const inventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = inventoryModel;
