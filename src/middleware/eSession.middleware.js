//pending...

const e_SessionModel = require("../models/eSession.model");
const crypto = require("crypto");

async function preUserSessionMiddleware(req, res, next) {
  let sessionId = req.cookies.sessionId;
  let session;

  if (sessionId) {
    session = await e_SessionModel.findOne({ sessionId });
  }

  if (!session) {
    sessionId = crypto.randomUUID();
    session = await e_SessionModel.create({
      sessionId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
    });
  }
  if (req.user && !session.userId) {
    session.userId = req.user._id;
    await session.save();
  }
  req.sessionId = sessionId;
  next();
}

module.exports = preUserSessionMiddleware ;
