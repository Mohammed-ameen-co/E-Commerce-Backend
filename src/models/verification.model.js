const crypto = require("crypto");
const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
      index: true,
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
    type: {
      type: String,
      enum: ["EMAIL_VERIFY", "RESET_PASSWORD"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"],
    },
  },
  {
    timestamps: true,
  },
);

verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

verificationSchema.pre("save", async function () {
  if (!this.isModified("token")) {
    return;
  }
  this.token = crypto.createHash("sha256").update(this.token).digest("hex");
  return;
});
verificationSchema.methods.compareToken = async function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return this.token === hashedToken;
};
const verificationModel = mongoose.model("verification", verificationSchema);

module.exports = verificationModel;
