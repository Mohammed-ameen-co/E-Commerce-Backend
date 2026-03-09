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

async function createOrders(req, res) {
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
        message: "Address not found please chack you address ID",
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

    const variants = {};
    for (const i of cart.item) {
      const variant = await variantModel.findById(i.variantId);
      if (!variant || variant.stock < i.quantity) {
        return res.status(400).json({
          message: "insufficiant stock",
        });
      }
      variants[i.variantId] = variant;
      totalPrice += i.price * i.quantity;
    }
    const shippingCharge = totalPrice > 500 ? 0 : 60;

    const order = await orderModel.create({
      userId,
      addressId: address._id,
      shippingAddress,
      items: cart.item,
      totalPrice,
      shippingCharge,
      orderType,
    });

    for (const i of cart.item) {
      const variant = variantId[i.variantId];

      if (variant) {
        variant.stock -= i.quantity;
        await variant.save();
      }
    }
    cart.item = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at createOrder function",
      error: error.message,
    });
  }
}

module.exports = {
  createOrders,
};
