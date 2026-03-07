const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      index: true,
      unquie: true,
    },
    item: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "inventory",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "variant",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
