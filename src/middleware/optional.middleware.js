const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) next();

  const token = authHeader.split(" ")[1];
  if (!token) next();

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userModel.findById(decode._id);

    if (user) {
      req.user = user;

      next();
    }

    next();
  } catch (error) {
    next();
  }
}

module.exports = { optionalAuthMiddleware };
