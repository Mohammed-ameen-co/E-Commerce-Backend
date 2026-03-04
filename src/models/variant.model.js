const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inventory",
      required: [true, "Product ID must be required"],
      index: true,
    },
    productImage: {
      type: String,
      required: [true, "Product Image URL is required"],
      trim: true,
      match: [
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
        "Please use a valid image URL (jpg, jpeg, png, gif, webp)",
      ],
    },
    color: {
      type: String,
      trim: true,
      minlength: [3, "Color must be at least 3 characters long"],
      maxlength: [50, "Color must be less than 50 characters long"],
      lowercase: true,
      required: [true, "Color is required"],
    },
    size: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Size is required"],
      enum: [
        "FREE",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "4XL",
        "5XL",
        "6XL",
      ],
    },
    stock: {
      type: Number,
      min: [0, "Stock must be a positive number"],
      required: [true, "Stock quantity is required"],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
      min: [0, "Product Price must be a positive number"],
      index: true,
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

variantSchema.index(
  {
    productId: 1,
    color: 1,
    size: 1,
  },
  { unique: true },
);

const variantModel = mongoose.model("variant", variantSchema);

module.exports = variantModel;
