const mongoose = require("mongoose");
const addressModel = require("../models/address.model");

async function createUserAddress(req, res) {
  try {
    const {
      fullname,
      region,
      phonenumber,
      state,
      zipcode,
      city,
      landmark,
      area,
    } = req.body;

    const userAddress = await addressModel.create({
      userId: req.user._id,
      fullname,
      region,
      phonenumber,
      state,
      zipcode,
      city,
      landmark,
      area,
    });

    return res.status(201).json({
      message: "Successfully created user address",
      address: userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at createUserAddress function",
      error: error.message,
    });
  }
}

async function editUserAddress(req, res) {
  try {
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        message: "Invalid address ID",
      });
    }

    const updateFild = {};

    Object.keys(req.body).forEach((key) => {
      if (req.body[key]) {
        updateFild[key] = req.body[key];
      }
    });

    const address = await addressModel.findOneAndUpdate(
      { _id: addressId, userId: req.user._id },
      { $set: updateFild },
      { new: true, runValidators: true },
    );

    if (address) {
      return res.status(404).json({
        message: "Address data not found",
      });
    }

    return res.status(200).json({
      message: "Address successfully update",
      address: address,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at editUserAddress function",
      error: error.message,
    });
  }
}

async function removeUserAddress(req, res) {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({
        message: "address ID is required",
      });
    }
    const userId = req.user._id;

    const address = await addressModel.findOneAndDelete({
      _id: addressId,
      userId: userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(200).json({
      message: "Item remove successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at removeUserAdderss function",
      error: error.message,
    });
  }
}

async function getAllAddress(req, res) {
  try {
    const userId = req.user._id;
    let address = await addressModel.findOne({ userId });

    return res.status(200).json({
      message: "Address data successfully get",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error at getAllAddress function",
      error: error.message,
    });
  }
}

module.exports = {
  createUserAddress,
  editUserAddress,
  removeUserAddress,
  getAllAddress,
};
