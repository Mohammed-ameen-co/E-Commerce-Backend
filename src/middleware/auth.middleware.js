const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Login required" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Invalid token format" });

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userModel.findById(decode._id);

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function chackAdmin(req, res, next) {
  console.log("User role:", req.user.role);
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}
module.exports = {
  authMiddleware,
  chackAdmin,
};
