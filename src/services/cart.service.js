const cartModel = require("../models/cart.model");
const variantModel = require("../models/variant.model");

async function createCart(data, user) {
  const { variantId, quantity } = data;

  const variant = await variantModel.findById(variantId);

  if (!variant) {
    throw new Error("variant not found");
  }

  if (quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  const productId = variant.productId;

  if (variant.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const userId = user._id;

  let cart = await cartModel.findOne({ userId });

  if (cart) {
    const item = cart.item.find((i) => i.variantId.equals(variantId));

    if (item) {
      if (item.quantity + quantity > variant.stock) {
        throw new Error("stock is limited");
      }
      item.quantity += quantity;
      item.price = variant.price;
    } else {
      cart.item.push({
        productId,
        variantId,
        quantity,
        price: variant.price,
      });
    }
    await cart.save();
  } else {
    cart = await cartModel.create({
      userId,
      item: [
        {
          productId: productId,
          variantId: variantId,
          quantity: quantity,
          price: variant.price,
        },
      ],
    });
  }

  return cart;
}

async function removeItem(variantId, user) {
  if (!variantId) {
    throw new Error("Variant ID not found");
  }
  const userId = user._id;

  const cart = await cartModel.updateOne(
    { userId },
    {
      $pull: { item: { variantId } },
    },
  );

  return cart;
}

async function removeOneItem(variantId, user) {
  if (!variantId) {
    throw new Error("Variant ID not found");
  }
  const userId = user._id;

  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart) {
    const item = cart.item.find((i) => i.variantId.equals(variantId));
    if (item && item.quantity > 1) {
      await cartModel.updateOne(
        {
          userId,
          "item.variantId": variantId,
        },
        {
          $inc: {
            "item.$.quantity": -1,
          },
        },
      );
    } else {
      await cartModel.updateOne(
        { userId },
        {
          $pull: { item: { variantId } },
        },
      );
    }
  }
  return cart;
}

async function getAllCart(user) {
  const userId = user._id;
  let cart = await cartModel.findOne({ userId });

  return cart;
}

module.exports = {
  createCart,
  removeItem,
  removeOneItem,
  getAllCart,
};

//All cart pending....
