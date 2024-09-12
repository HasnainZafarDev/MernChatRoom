const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const Room = require("../models/roomModel.js");
const User = require("../models/userModel.js");
const Message = require("../models/messageModel.js");

sendMessageInARoom = asyncHandler(async (req, res, next) => {
  try {
    const { content, roomId } = req.body;
    const isPrivate = false;
    const senderId = req.user.id;
    if (!content) {
      throw new ApiError(400, "Message content is required");
    }
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }
    if (!room.participants.includes(senderId)) {
      throw new ApiError(403, "You are not part of this room");
    }
    let message;
    message = new Message({
      content,
      sender: senderId,
      room: roomId,
      isPrivate,
    });

    await message.save();
    res
      .status(201)
      .json(new ApiResponse(200, message, "Message sent successfully"));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
});

getRoomMessages = asyncHandler(async (req, res, nect) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }
    const messages = await Message.find({
      room: roomId,
    })
      .populate("sender", "username")
      .populate("recipient", "username")
      .sort({ createdAt: "asc" });
    res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

sendMessageToUser = asyncHandler(async (req, res, next) => {
  try {
    const { content, recipientId } = req.body;
    const isPrivate = true;
    const senderId = req.user.id;
    if (!content) {
      throw new ApiError(400, "Message content is required");
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw new ApiError(404, "Recipient not found");
    }
    let message;
    message = new Message({
      content,
      sender: senderId,
      recipient: recipientId,
      isPrivate,
    });
    await message.save();
    res
      .status(201)
      .json(new ApiResponse(200, message, "Message sent successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

getPrivateMessages = asyncHandler(async (req, res, next) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user.id;
    const messages = await Message.find({}).sort({ createdAt: "asc" });

    if (!messages.length) {
      throw new ApiError(
        404,
        "No private messages found between these users in this room"
      );
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          messages,
          "Private messages retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while retrieving private messages"
    );
  }
});

module.exports = {
  sendMessageInARoom,
  getRoomMessages,
  getPrivateMessages,
  sendMessageToUser,
};
