const jwt = require("jsonwebtoken");

function accesstoken(user) {
  const payload = {
    _id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",//testing purpuse
  });
}

function refreshtoken(user) {
  const payload = {
    _id: user._id,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "3d",//testing purpuse
  });
}

function verifyRefreshToken(token) {
  const decodeRefreshToken = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
  );
  return decodeRefreshToken;
}

module.exports = { accesstoken, refreshtoken, verifyRefreshToken };
