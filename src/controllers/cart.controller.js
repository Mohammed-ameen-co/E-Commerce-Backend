const cartModel = require("../models/cart.model");
const variantModel = require("../models/variant.model");

async function createCart(req, res) {
  try {
    const { variantId, quantity } = req.body;

    const variant = await variantModel.findById(variantId);

    if (!variant) {
      return res.status(404).json({
        message: "variant not found",
      });
    }

    const productId = variant.productId;

    if (variant.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    const userId = req.user._id;

    let cart = await cartModel.findOne({ userId });

    if (cart) {
      const item = cart.item.find((i) => i.variantId.equals(variantId));

      if (item) {
        if (item.quantity + quantity > variant.stock) {
          return res.status(400).json({
            message: "stock is limited",
          });
        }
        item.quantity += quantity;
      } else {
        cart.item.push({ productId, variantId, quantity });
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
          },
        ],
      });
    }

    return res.status(201).json({
      message: "Cart successfully created",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at createCart function",
      error: error.message,
    });
  }
}

async function removeItem(req, res) {
  try {
    const { variantId } = req.params;
    if (!variantId) {
      return res.status(404).json({
        message: "Veriant ID not found",
      });
    }
    const userId = req.user._id;

    const cart = await cartModel.updateOne(
      { userId },
      {
        $pull: { item: { variantId } },
      },
    );

    return res.status(200).json({
      message: "Item remove successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at removeItem function",
      error: error.message,
    });
  }
}

async function removeOneItem(req, res) {
  try {
    const { variantId } = req.params;

    if (!variantId) {
      return res.status(404).json({
        message: "Variant ID missing",
      });
    }
    const userId = req.user._id;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
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
    return res.status(200).json({
      message: "Item remove successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at removeOneItem function",
      error: error.message,
    });
  }
}

async function getAllCart(req, res) {
  try {
    const userId = req.user._id;
    let cart = await cartModel.findOne({ userId });

    return res.status(200).json({
      message: "Cart data successfully get",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at getAllCart function",
      error: error.message,
    });
  }
}

module.exports = {
  createCart,
  removeItem,
  removeOneItem,
  getAllCart,
};

//All cart pending....
