const User = require("../models/userModel");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const token = user.generateToken();
    await user.save({ validateBeforeSave: false });
    return { token };
  } catch (error) {
    console.error("Error while generating token:", error.message);
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ username, email, password });
    if (user) {
      const { token } = await generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        rooms: user.rooms,
        token: token,
      });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const { token } = await generateToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");
    const options = {
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({
        statusCode: 200,
        data: {
          user: loggedInUser,
          token,
        },
        success: true,
        message: "User Logged In Successfully",
      });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      data: null,
      success: false,
      message: error.message || "Invalid Access Token",
    });
  }
};

const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { new: true });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, null, "User Logged Out Successfully"));
});
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json(new ApiResponse(200, users, "Users"));
});

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(new ApiResponse(200, user, "User"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

module.exports = { createUser, loginUser, logoutUser, getAllUsers, getUser };
