const express = require("express");
const {
  createRoom,
  getAllRooms,
  joinRoom,
  getSingleRoom,
  deleteRoom,
  updateRoomName,
  leaveRoom
} = require("../controllers/roomController");

const { verifyJWT } = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.post("/create",verifyJWT, createRoom);
router.get("/", getAllRooms);
router.post("/join",verifyJWT, joinRoom);
router.get("/:id", getSingleRoom);
router.delete("/",verifyJWT,deleteRoom);
router.put("/:id",verifyJWT,updateRoomName)
router.post('/leave',verifyJWT,leaveRoom)

module.exports = router;
