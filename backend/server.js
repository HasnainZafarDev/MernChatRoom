const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");
const messageRoute = require("./routes/messageRoute");
const cookieParser = require("cookie-parser");
const app = express();

const connectDb = require("./config/db");

dotenv.config();
connectDb();
app.use(cookieParser());

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/room", roomRoute);
app.use("/api/messages", messageRoute);
app.get("/", (req, res) => {
  res.send("Api World");
});
app.listen(
  process.env.PORT,
  console.log(`Server Started On Port ${process.env.PORT}`.yellow.bold)
);
