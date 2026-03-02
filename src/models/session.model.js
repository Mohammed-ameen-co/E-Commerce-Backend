const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, "Token hash is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    device: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ expiresAt: 1}, { expireAfterSeconds: 0 });


sessionSchema.pre("save", async function () {
  if (!this.isModified("tokenHash")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.tokenHash = await bcrypt.hash(this.tokenHash, salt);
  return;
});

sessionSchema.methods.compareTokenHash = async function (token) {
  return await bcrypt.compare(token, this.tokenHash);
};


const sessionModel = mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
