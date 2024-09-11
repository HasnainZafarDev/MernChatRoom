const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const Room = require("../models/roomModel.js");
const User = require("../models/userModel.js");

createRoom = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const creatorId = req.user.id;
    console.log("🚀 ~ createRoom=asyncHandler ~ creatorId:", creatorId)
    const creator = await User.findById(creatorId);
    if (!creator) {
      throw new ApiError(404, "User not found");
    }
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Room already exists"));
    }
    const newRoom = new Room({
      name,
      creatorId,
      participants: [creatorId],
    });
    await newRoom.save();
    creator.rooms.push(newRoom._id);
    await creator.save();
    res.status(201).json(new ApiResponse(200, newRoom, "Room created"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating room");
  }
});
getAllRooms = asyncHandler(async (req, res, next) => {
  try {
    const rooms = await Room.find().populate('creatorId', 'username').populate('participants', 'username')
    if (rooms.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "No Rooms Found First Create Room"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, rooms, "Here are your rooms"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
});

joinRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (room.participants.includes(userId)) {
      return res.status(400).json({ message: "User is already in the room" });
    }
    room.participants.push(userId);
    await room.save();
    user.rooms.push(roomId);
    await user.save();
    res.status(200).json({ message: "User joined the room successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error joining the room" });
  }
});

getSingleRoom = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate('participants', 'username')
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving room" });
  }
});

deleteRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }
    if (room.creatorId.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to delete this room");
    }
    await room.deleteOne();
    await User.updateMany({ rooms: roomId }, { $pull: { rooms: roomId } });
    res
      .status(200)
      .json(new ApiResponse(200, null, "Room deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

updateRoomName = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const { name } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }
    if (room.creatorId.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to update this room");
    }
    room.name = name || room.name;
    await room.save();
    res
      .status(200)
      .json(new ApiResponse(200, room, "Room updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating room details");
  }
});

leaveRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id; 
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }
    if (!room.participants.includes(userId)) {
      throw new ApiError(400, "You are not a participant in this room");
    }
    room.participants = room.participants.filter(participant => participant.toString() !== userId.toString());
    await room.save();
    await User.findByIdAndUpdate(userId, { $pull: { rooms: roomId } });
    res.status(200).json(new ApiResponse(200, null, "You have left the room successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while leaving the room");
  }
});

module.exports = {
  createRoom,
  getAllRooms,
  joinRoom,
  getSingleRoom,
  deleteRoom,
  updateRoomName,
  leaveRoom,
};
