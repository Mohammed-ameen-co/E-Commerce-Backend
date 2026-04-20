const reviewModel = require("../models/review.model");
const orderModel = require("../models/orders.model");
const productModel = require("../models/inventory.model");

async function createReview(req, res) {
  try {
    const { orderId } = req.params;
    const { productId, variantId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId) ) {
      return res.status(400).json({ message: `invalid order id`});
    }
    if (!mongoose.Types.ObjectId.isValid(productId) ) {
      return res.status(400).json({ message: `invalid product id`});
    }
    if (!mongoose.Types.ObjectId.isValid(variantId) ) {
      return res.status(400).json({ message: `invalid variant id`});
    }

    const order = await orderModel.findOne({ _id: orderId, userId, status: "Delivered" });
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }


    const isProductInOrder = order.items.some(
        (item) =>
            item.productId.toString() === productId &&
            item.variantId.toString() === variantId
    );
    if (!isProductInOrder) {
      return res.status(400).json({ message: "product not found in order" });
    }

    if(rating === undefined || rating < 1 || rating > 5 ){
        return res.status(400).json({ message: "rating must be between 1 to 5" });
    }
    await reviewModel.create({
        userId,
        orderId,
        productId,
        variantId,
        rating,
        comment
    })

    return res.status(201).json({ message: "review created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in creating review", error: error.message });
  }
}

module.exports = {
    createReview,

}