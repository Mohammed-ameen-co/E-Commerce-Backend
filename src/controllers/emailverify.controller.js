const verificationModel = require("../models/verification.model");
const userModel = require("../models/user.model");
const crypto = require("crypto");

async function sendSignUpEmail(req, res) {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Verification token is required",
    });
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const isVerificationRecord = await verificationModel.findOne({ token: hashedToken });
  if (!isVerificationRecord) {
    return res.status(400).json({
      message: "Invalid or expired verification token",
    });
  }
  const userId = await userModel.findById(isVerificationRecord.userId);
  userId.isEmailVerified = true;
  await userId.save();
  await isVerificationRecord.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Email successfully verified",
    });
}

module.exports = {
    sendSignUpEmail
}