const inventoryService = require("../services/inventory.service");

//This function create new products in inventory schema
async function createInventoryProducts(req, res) {
  try {
    const product = await inventoryService.createInventory(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Product successfully created",
      products: product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
}

//It update field in the inventory schema
async function update_product(req, res) {
  try {
    const { productId } = req.params;
    const product = await inventoryService.updateProduct(productId, req.body);

    return res.status(200).json({
      message: "Product updated success",
      products: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at update_product function",
      error: error.message,
    });
  }
}

//And this is get the all invetory schema products
async function getAllInventoryProduct(req, res) {
  try {
    const product = await inventoryService.getProducts(req.query);

    return res.status(200).json({
      success: true,
      products: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error from get all inventory product",
      error: error.message,
    });
  }
}

module.exports = {
  createInventoryProducts,
  update_product,
  getAllInventoryProduct,
};
