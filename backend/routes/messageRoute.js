const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  sendMessageInARoom,
  getRoomMessages,
  getPrivateMessages,
} = require("../controllers/messageController.js");

router.post("/send", verifyJWT, sendMessageInARoom);
router.get("/:roomId", verifyJWT, getRoomMessages);
router.get("/private/:roomId/:recipientId", verifyJWT, getPrivateMessages);

module.exports = router;
