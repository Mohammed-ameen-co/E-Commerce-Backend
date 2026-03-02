const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Admin ID is required"],
      index: true,
    },
    categoryName: {
      type: String,
      required: [true, "Category Name is required"],
      trim: true,
      minlength: [3, "Category Name must be at least 3 characters long"],
      maxlength: [50, "Category Name must be less than 50 characters long"],
      unique: [true, "Category Name must be unique"],
    },
  },
  { timestamps: true },
);

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
