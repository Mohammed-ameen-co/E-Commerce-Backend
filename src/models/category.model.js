const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Admin ID is required"],
      index: true,
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default: null,
      index: true,
    },
    categoryName: {
      type: String,
      required: [true, "Category Name is required"],
      trim: true,
      minlength: [3, "Category Name must be at least 3 characters long"],
      maxlength: [50, "Category Name must be less than 50 characters long"],
      index: true,
    },
    level: {
      type: Number,
      min: [1, "Level must be at least 1"],
    },
    isDeleted:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

categorySchema.index(
  { categoryName: 1, parentCategoryId: 1 },
  { unique: true },
);

categorySchema.pre("save", async function(){
  if (this.parentCategoryId) {
    const parent = await mongoose.model("category").findById(this.parentCategoryId);
    this.level = parent.level + 1;
  }
  else{
    this.level = 1;
  }
});
const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
