const cartModel = require("../models/cart.model");
const e_SessionModel = require("../models/eSession.model");

async function createCart(req, res) {
  try {
    const { variantId, quantity } = req.body;

    if (!variantId || quantity === undefined) {
      return res.status(400).json({
        message: "Variant Id and quantity is required",
      });
    }

    const parsedQuantity = Number(quantity);

    if (isNaN(parsedQuantity)) {
      return res.status(400).json({
        message: "Quantity must be a valid number",
      });
    }

    if (parsedQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater then 0",
      });
    }
    const sessionId = req.sessionId;

    const preUserSession = await e_SessionModel.findOne({ sessionId });

    if (!preUserSession) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    let cart = await cartModel.findOne({
      $or: [{ sessionId }, { userId: preUserSession.userId }],
    });

    if (cart) {
      const item = cart.item.find((i) => i.variantId.equals(variantId));

      if (item) {
        item.quantity += parsedQuantity;
      } else {
        cart.item.push({ variantId, quantity: parsedQuantity });
      }
      await cart.save();
    } else {
      cart = await cartModel.create({
        sessionId,
        item: [{ variantId: variantId, quantity: parsedQuantity }],
      });
    }

    const userId = preUserSession.userId;

    if (userId && !cart.userId) {
      cart.userId = userId;
      await cart.save();
    }

    return res.status(200).json({
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
    const sessionId = req.sessionId;

    const cart = await cartModel.updateOne(
      { sessionId },
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
    const sessionId = req.sessionId;

    let cart = await cartModel.findOne({ sessionId });

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
            sessionId,
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
          { sessionId },
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
    const sessionId = req.sessionId;
    const preUserSession = await e_SessionModel.findOne({ sessionId });
    if (!preUserSession) {
      return res.status(404).json({
        message: "Session not found",
      });
    }
    const userId = preUserSession.userId;
    let cart;
    if (userId) {
      cart = await cartModel.findOne({ userId });
    } else {
      cart = await cartModel.findOne({ userId });
    }
    return res.status(200).json({
        message: "Cart data successfully get",
        cart,
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at removeOneItem function",
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