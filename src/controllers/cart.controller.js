const cartService = require("../services/cart.service");

async function createCart(req, res) {
  try {
    const cart = await cartService.createCart(req.body, req.user);

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

    const cart = await cartService.removeItem(variantId, req.user);

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
    const cart = await cartService.removeOneItem(variantId, req.user);
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
    const cart = await cartService.getAllCart(req.user);

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
