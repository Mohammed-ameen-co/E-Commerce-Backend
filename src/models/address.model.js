const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    region: {
      type: String,
      required: [true, "country name is required"],
      trim: true,
    },
    phonenumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "state name is required"],
      trim: true,
    },
    zipcode: {
      type: String,
      required: [true, "city zipcode/pincode required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "city name is required"],
      trim: true,
    },
    landmark: {
      type: String,
      required: [true, "Name any important place near your address."],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "which area is you belong is required"],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const addressModel = mongoose.model("address", addressSchema);

module.exports = addressModel;
