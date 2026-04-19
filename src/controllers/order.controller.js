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
    const { addressId, orderMethod } = req.body;
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        message: "Invalid address ID",
      });
    }
    if (!orderMethod) {
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
      totalPrice += variant.price * i.quantity;
    }
    const shippingCharge = totalPrice > 500 ? 0 : 60; // ise dynamic karna hoga

    session = await mongoose.startSession();

    session.startTransaction();
    
    if (orderMethod === "online") {
      /* online payment process is pending for now, as payment gateway integration is not done yet.
       after successful payment totalPrice, shippingCharge and orderMethod will be updated in order document.*/
    }

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
          orderMethod,
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

//2 complete ?
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

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "order data not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({
        message: "Not allowed to update order status",
      });
    }
    const statusFlow = {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };
    if (!statusFlow[order.status].includes(status)) {
      return res.status(400).json({ message: "invalid status" });
    }

    order.status = status;

    if (order.orderMethod === "COD" && status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

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

//3 order cancellation...

async function orderCancellation(req, res) {
  let session;
  try {
    const { orderId } = req.params;
    const { cancelReason } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }
    const isAdmin = req.user.role === "admin";
    let order;
    if (isAdmin && cancelReason) {
      order = await orderModel.findOne({ _id: orderId });
    } else {
      order = await orderModel.findOne({ _id: orderId, userId });
    }

    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "order already cancelled",
      });
    }

    const isFixedStatus = ["Shipped", "Delivered"].includes(order.status);

    if ( isFixedStatus ) {
      return res.status(400).json({
        message: "order cannot be cancelled after shipped or delivered",
      });
    }

    const payMetRefundable =
      order.orderMethod === "online" && order.paymentStatus === "Paid";

    session = await mongoose.startSession();

    session.startTransaction();

    order.status = "Cancelled";
    order.cancelReason = cancelReason || "not specified";
    order.cancelledAt = new Date();

    if (payMetRefundable) {
      /* refund process and update payment status to refunded is pending for now,
       as payment gateway integration is not done yet.*/
      order.paymentStatus = "Refunded";
    }

    await order.save({ session });

    const operations = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.variantId },
        update: { $inc: { stock: item.quantity } },
      },
    }));

    await variantModel.bulkWrite(operations, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "order canclled",
      order,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({
      message: "Internal server error at orderCancellation function",
      error: error.message,
    });
  }
}

module.exports = {
  createOrders,
  updateOrderStatus,
  orderCancellation,
};
