const orderModel = require("../models/orders.model");
const addressModel = require("../models/address.model");
const cartModel = require("../models/cart.model");
const variantModel = require("../models/variant.model");
const mongoose = require("mongoose");

/**
 * 1. A user has placed an order and has two payment options:
 * cash on delivery (COD) and online.
 * They will select one. I'll look at how to pay online.
 *
 * 2. I need to create a function for admin to update the status.
 *
 * 3. I need to create order cancellation and refund facility for the user.
 *
 * that's it for now.
 */

//1 half complete
async function createOrders(req, res) {
  let session;
  try {
    const { addressId, orderType } = req.body;
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        message: "Invalid address ID",
      });
    }
    if (!orderType) {
      return res.status(400).json({
        message: "Bad request: Order type required",
      });
    }

    const address = await addressModel.findById(addressId);

    if (!address) {
      return res.status(404).json({
        message: "Address not found please check you address ID",
      });
    }

    const shippingAddress = {
      name: address.fullname,
      phone: address.phonenumber,
      country: address.region,
      state: address.state,
      city: address.city,
      zipcode: address.zipcode,
      street: `${address.area} ${address.landmark || ""}`,
    };

    const userId = req.user._id;
    const cart = await cartModel.findOne({ userId });

    if (!cart || cart.item.length === 0) {
      return res.status(400).json({
        message: "cart empty",
      });
    }

    let totalPrice = 0;

    const variantIds = cart.item.map((i) => i.variantId);

    const variantDocs = await variantModel.find({
      _id: { $in: variantIds },
    });

    const variants = new Map();

    for (const v of variantDocs) {
      variants.set(v._id.toString(), v);
    }
    for (const i of cart.item) {
      const variant = variants.get(i.variantId.toString());
      if (!variant || variant.stock < i.quantity) {
        return res.status(400).json({
          message: "insufficient stock",
        });
      }
      totalPrice += i.price * i.quantity;
    }
    const shippingCharge = totalPrice > 500 ? 0 : 60;

    session = await mongoose.startSession();

    session.startTransaction();

    const order = await orderModel.create(
      [
        {
          userId,
          addressId: address._id,
          shippingAddress,
          items: cart.item.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
          totalPrice,
          shippingCharge,
          orderType,
        },
      ],
      { session },
    );

    const operations = cart.item.map((i) => ({
      updateOne: {
        filter: { _id: i.variantId },
        update: { $inc: { stock: -i.quantity } },
      },
    }));

    await variantModel.bulkWrite(operations, { session });

    cart.item = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      message: "Order placed",
      order,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({
      message: "Internal server error at createOrder function",
      error: error.message,
    });
  }
}

//2 complete
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    if (!status || !paymentStatus) {
      return res.status(400).json({
        message: "status and paymentStatus is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const allowedStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "invalid status" });
    }
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { $set: { status, paymentStatus } },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        message: "order data not found",
      });
    }
    return res.status(200).json({
      message: "order data successfully update",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at updateOrderStatus function",
      error: error.message,
    });
  }
}

//3 pending...

module.exports = {
  createOrders,
  updateOrderStatus,
};
