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
    variant: [
      {
        productImage: {
          type: String,
          required: [true, "Product Image URL is required"],
          trim: true,
          match: [
            /^http?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
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
          enum: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"],
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
      },
    ],
  },
  { timestamps: true },
);

inventorySchema.index({
  productName: "text",
  description: "text",
});
inventorySchema.index({
  "variant.color": 1,
  "variant.size": 1,
});
inventorySchema.index({
  categoryId: 1,
  "variant.price": 1,
});

inventorySchema.pre("save", function () {
  if (!this.variant || this.variant.length === 0) return;

  const combinations = this.variant.map((v) => `${v.color}_${v.size}`);

  const unique = new Set(combinations);

  if (unique.size !== combinations.length) {
    throw new Error("Duplicate variant combination not allowed");
  }
});

const inventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = inventoryModel;
