import axios from "axios";

export const fetchCurrentUser = async () => {
  const { data } = await axios.get("/api/user/getUser");
  return data.data;
};

export const fetchRooms = async () => {
  const { data } = await axios.get("/api/room");
  return data.data;
};

export const joinRoom = async (roomId) => {
  return await axios.post("/api/room/join", { roomId });
};

export const leaveRoom = async (roomId) => {
  return await axios.post("/api/room/leave", { roomId });
};

export const deleteRoom = async (roomId) => {
  return await axios.delete("/api/room", { data: { roomId } });
};

export const fetchMessages = async (roomId) => {
  const { data } = await axios.get(`/api/messages/${roomId}`);
  return data.data;
};

export const sendMessage = async (roomId, content) => {
  const { data } = await axios.post("/api/messages/send", { roomId, content });
  return data.data;
};
