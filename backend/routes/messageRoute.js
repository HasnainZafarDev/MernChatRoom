const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  sendMessageInARoom,
  getRoomMessages,
  getPrivateMessages,
  sendMessageToUser
} = require("../controllers/messageController.js");


//----- For room Chats
router.post("/send", verifyJWT, sendMessageInARoom);
router.get("/:roomId", verifyJWT, getRoomMessages);
 
//----- For Individual Chats
router.post("/sendtouser", verifyJWT, sendMessageToUser);
router.get("/private/:recipientId", verifyJWT, getPrivateMessages);

module.exports = router;
