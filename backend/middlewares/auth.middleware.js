const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const User = require("../models/userModel.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token - User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Unauthorized - No token provided") {
      res.send("Login First")
    }
    return next(new ApiError(401, error?.message || "Invalid Access Token"));
  }
});

module.exports = { verifyJWT };
