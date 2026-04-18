const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const tokenUtils = require("../utils/token.utils");
const verificationModel = require("../models/verification.model");
const crypto = require("crypto");
const emailUtils = require("../utils/email.utils");

async function handleUserRegister(req, res) {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    await verificationModel.create({
      userId: user._id,
      token: verificationToken,
      type: "EMAIL_VERIFY",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const verificationLink = `${process.env.BASE_URL}/api/verify-email/${verificationToken}`; //If you are using the frontend, replace BASE_URL with CLIENT_URL.
    await emailUtils.sendSignUpEmail(user.email, user.name, verificationLink);

    return res.status(201).json({
      success: true,
      message: "User successfully created",
      verificationLink: verificationLink, // Include the verification link in the response for testing purposes
      verificationToken: verificationToken, // Include the token in the response for testing purposes
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Please try again with correct credentials" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }
    const isPasswrodValid = await user.comparePassword(password);

    if (!isPasswrodValid) {
      return res
        .status(401)
        .json({ message: "Please try again with correct password" });
    }
    const accessToken = tokenUtils.accesstoken(user);
    const refreshToken = tokenUtils.refreshtoken(user);

    await sessionModel.create({
      userId: user._id,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      device: req.headers["user-agent"],
    });
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name || null,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken: accessToken,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function handleLogoutUsers(req, res) {
  try {
    if (!req.cookies.refreshToken)
      return res.status(400).json({ message: "Missing refresh token" });

    const refreshToken = req.cookies.refreshToken;
    const decode = tokenUtils.verifyRefreshToken(refreshToken);

    const session = await sessionModel.findOne({
      userId: decode._id,
      isRevoked: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const isValidToken = await session.compareTokenHash(refreshToken);
    if (!isValidToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    session.isRevoked = true;
    await session.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
}

async function handleRefreshTokenUsers(req, res) {
  try {
    if (!req.cookies.refreshToken) {
      console.log(req.cookies.refreshToken);
      return res
        .status(401)
        .json({ message: "Missing / invalid refresh token" });
    }
    const getRefreshToken = req.cookies.refreshToken;

    const decode = tokenUtils.verifyRefreshToken(getRefreshToken);
    const user = await userModel.findById(decode._id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found during refresh token validation" });

    const session = await sessionModel.findOne({
      userId: user._id,
      isRevoked: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!session) {
      return res.status(401).json({ message: "Session not found or revoked" });
    }

    const isValidToken = await session.compareTokenHash(getRefreshToken);

    if (!isValidToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const SESSION_TTL = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    session.expiresAt = new Date(Date.now() + SESSION_TTL);

    await session.save();

    const newAccessToken = tokenUtils.accesstoken(user);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

//this is change current password
async function changePassword(req, res) {
  try {
    const { password, newPassword, conffPassword } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not found during auth" });
    }

    if (!password || !newPassword || !conffPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== conffPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const getUser = await userModel.findById(user._id).select("+password");

    const isMatch = await getUser.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    getUser.password = newPassword;

    await getUser.save();

    await sessionModel.deleteMany({ userId: user._id });

    return res.status(200).json({ message: "password change" });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

//this is send forgot password link
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "if this email exists, a reset link hase been sent" });
    }

    await verificationModel.deleteMany({
      userId: user._id,
      type: "RESET_PASSWORD",
    });
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await verificationModel.create({
      userId: user._id,
      token: verificationToken,
      type: "RESET_PASSWORD",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const resetLink = `${process.env.BASE_URL}/api/reset-password/${user._id}/${verificationToken}`; //If you are using the frontend, replace BASE_URL with CLIENT_URL.
    await emailUtils.sendForgotPasswordEmail(user.email, user.name, resetLink);

    return res.status(200).json({
      message: "if this email exists, a reset link hase been sent",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

//this is reset current password
async function resetPassword(req, res) {
  try {
    const { userId, token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const verification = await verificationModel.findOne({
      userId,
      type: "RESET_PASSWORD",
    });

    if (!verification) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }
    const isMatch = await verification.compareToken(token);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    await verificationModel.deleteOne({ _id: verification._id });

    await sessionModel.deleteMany({ userId });

    return res.status(200).json({
      message: "Successfully set new password",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  handleUserRegister,
  handleUserLogin,
  handleLogoutUsers,
  handleRefreshTokenUsers,
  changePassword,
  forgotPassword,
  resetPassword,
};
