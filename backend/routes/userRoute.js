const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUser,
} = require("../controllers/userController");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

router.get("",verifyJWT, getAllUsers);
router.get("/getuser", verifyJWT, getUser);

module.exports = router;
