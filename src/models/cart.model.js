const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      index: true,
    },
    item: [
      {
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
cartSchema.index({ userId: 1 }, { unique: true, sparse: true });

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
