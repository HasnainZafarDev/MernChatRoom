import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { MdCheckCircle } from "react-icons/md";
import RoomChats from "./RoomChats";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("/api/user/getUser");
        setCurrentUser(data.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/room");
        setRooms(data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    fetchMessages(room._id);
  };

  const handleHeaderClick = () => {
    onOpen();
  };

  const handleJoinRoom = async () => {
    try {
      await axios.post("/api/room/join", { roomId: selectedRoom._id });
      setSelectedRoom((prevRoom) => ({
        ...prevRoom,
        participants: [...prevRoom.participants, currentUser],
      }));
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === selectedRoom._id
            ? { ...room, participants: [...room.participants, currentUser] }
            : room
        )
      );
      toast({
        title: "You Joined The Room",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error while joining the room",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await axios.post("/api/room/leave", { roomId: selectedRoom._id });
      setSelectedRoom((prevRoom) => ({
        ...prevRoom,
        participants: prevRoom.participants.filter(
          (p) => p._id !== currentUser._id
        ),
      }));
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === selectedRoom._id
            ? {
                ...room,
                participants: room.participants.filter(
                  (p) => p._id !== currentUser._id
                ),
              }
            : room
        )
      );

      toast({
        title: "You Left The Room",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error While Leaving The Room",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await axios.delete("/api/room", { data: { roomId: selectedRoom._id } });
      toast({
        title: "Room Deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "You Are Not The Owner",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const isParticipant = selectedRoom?.participants.some(
    (p) => p._id === currentUser?._id
  );

  const fetchMessages = async (roomId) => {
    try {
      const { data } = await axios.get(`/api/messages/${roomId}`);
      setMessages(data.data); // Store messages in state
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error fetching messages",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post("api/messages/send", {
        roomId: selectedRoom._id,
        content: newMessage,
      });

      setMessages((prevMessages) => [...prevMessages, data.data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Message Not Sent",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isParticipant) {
        handleSendMessage(); // Only send message if user is a participant
      }
    }
  };

  return (
    <Flex height="100vh">
      {/* Left Side (Room List) */}
      <Box width="30%" bg="gray.100" p={4} overflowY="auto">
        <Heading size="md">Rooms</Heading>
        {rooms.map((room) => (
          <Box
            key={room.id}
            p={3}
            my={2}
            bg="white"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
            onClick={() => handleRoomClick(room)}
          >
            <Text fontWeight="bold">{room.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {room.creatorId.username}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Right Side (Selected Room Details) */}
      <Box flex="1" bg="white" p={4} display="flex" flexDirection="column">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <Box
              p={4}
              bg="gray.200"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid gray"
              cursor="pointer"
              onClick={handleHeaderClick}
            >
              <Box>
                <Heading size="md">{selectedRoom.name}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {selectedRoom.creatorId.username}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Participants:{" "}
                  {selectedRoom.participants.map((p) => p.username).join(", ")}
                </Text>
              </Box>
            </Box>

            {/* Chat Content */}
            <RoomChats messages={messages} currentUser={currentUser} />
            {/* Chat Input */}
            <FormControl mt={4} display="flex">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                isDisabled={!isParticipant}
              />
              <Tooltip
                label="Join the room to send a message"
                isDisabled={isParticipant}
                placement="top"
              >
                <Button
                  ml={2}
                  colorScheme="blue"
                  onClick={handleSendMessage}
                  disabled={!isParticipant}
                >
                  Send
                </Button>
              </Tooltip>
            </FormControl>
          </>
        ) : (
          <Text>Select a room to view details</Text>
        )}
      </Box>

      {/* Join/Delete Room Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedRoom?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isParticipant ? (
              <Text>Would you like to leave or delete this room?</Text>
            ) : (
              <Text>Do you want to join or delete this room?</Text>
            )}
          </ModalBody>
          <ModalFooter>
            {isParticipant ? (
              <Button colorScheme="yellow" onClick={handleLeaveRoom} mr={3}>
                Leave Room
              </Button>
            ) : (
              <Button colorScheme="green" onClick={handleJoinRoom} mr={3}>
                Join Room
              </Button>
            )}
            <Button colorScheme="red" onClick={handleDeleteRoom}>
              Delete Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AllRooms;
