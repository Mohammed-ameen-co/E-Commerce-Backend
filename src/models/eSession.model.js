const mongoose = require("mongoose");

const eSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, "Pre user session ID required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

eSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const e_SessionModel = mongoose.model("e_session", eSessionSchema);

module.exports = e_SessionModel;
