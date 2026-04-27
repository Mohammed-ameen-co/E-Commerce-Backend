const variantService = require("../services/variant.service");

//This is create new variant
async function createVariantForProducts(req, res) {
  try {
    const variant = await variantService.createVariantForProducts(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Product successfully created",
      variant,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating variant", error: error.message });
  }
}

//And it updates products variants in variant schema

async function updateA_Variant(req, res) {
  try {
    const { variantId } = req.params;
    const variant = await variantService.updateA_Variant(
      variantId,
      req.body,
      req.user,
    );
    return res.status(200).json({
      message: "successfully variant updated",
      variant: variant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This variant already exists",
      });
    }
    return res.status(500).json({
      message: "Internal server error in the updateA_Variant function",
      error: error.message,
    });
  }
}

module.exports = {
  createVariantForProducts,
  updateA_Variant,
};
