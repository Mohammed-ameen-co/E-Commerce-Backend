const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipcode: { type: String, required: true },
      street: { type: String, required: true },
    },
    items: [
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
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      required: true,
    },
    shippingCharge: {
      type: Number,
      min: 0,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      required: true,
    },
    orderType: {
      type: String,
      enum: ["COD", "online"],
      required: true,
    },
    cancelReason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("order", ordersSchema);

module.exports = orderModel;
