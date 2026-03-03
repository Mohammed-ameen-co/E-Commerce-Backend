const userModel = require("../models/user.model");

async function handleCreateAdmin(req, res) {
  try {
    const isAdminExists = await userModel.findOne({ role: "admin" });
    if (!isAdminExists) {
      await userModel.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        isEmailVerified: true,
      });
      return res.status(201).json({
        success: true,
        message: "Admin user created successfully",
      });
    }
    return res.status(400).json({
      message: "Admin is already exists",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating admin user",
      error: error.message,
    });
  }
}

module.exports = {
  handleCreateAdmin,
};
