import React, { useState, useEffect, useRef } from "react";
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
import CreateRoom from "./CreateRoom";
import useCurrentUser from "../../Hooks/useCurrentUser";
import useRooms from "../../Hooks/useRooms";
import { joinRoom, leaveRoom, deleteRoom, fetchMessages, sendMessage,  } from "../../utils/apiService";

const AllRooms = () => {
  const currentUser = useCurrentUser();
  const { rooms, setRooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const {
    isOpen: isJoinModalOpen,onOpen: onJoinModalOpen,onClose: onJoinModalClose} = useDisclosure();
  const {isOpen: isCreateModalOpen,onOpen: onCreateModalOpen,onClose: onCreateModalClose} = useDisclosure(); // For CreateRoom modal

  const initialRef = useRef(); // Ref for input focus in CreateRoom modal

  const toast = useToast();

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    handleFetchMessages(room._id);
  };

  const handleHeaderClick = () => {
    onJoinModalOpen();
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(selectedRoom._id);
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
      onJoinModalClose()
      toast({ title: "You Joined The Room", status: "success", duration: 5000 });
    } catch (error) {
      toast({ title: "Error while joining the room", status: "warning", duration: 5000 });
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(selectedRoom._id);
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
      onJoinModalClose()
      toast({ title: "You Left The Room", status: "success", duration: 5000 });
    } catch (error) {
      toast({ title: "Error While Leaving The Room", status: "warning", duration: 5000 });
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(selectedRoom._id);
      toast({ title: "Room Deleted", status: "success", duration: 5000 });
      onJoinModalClose()
      setSelectedRoom(null)

    } catch (error) {
      toast({ title: "You Are Not The Owner", status: "warning", duration: 5000 });
    }
  };


  const isParticipant = selectedRoom?.participants.some(
    (p) => p._id === currentUser?._id
  );

  const handleFetchMessages = async (roomId) => {
    try {
      const fetchedMessages = await fetchMessages(roomId)
      setMessages(fetchedMessages)
    } catch (error) {
      console.log("🚀 ~ fetchMessages ~ error:", error)
      
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await sendMessage(selectedRoom._id, newMessage);
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      toast({ title: "Message Not Sent", status: "error", duration: 5000 });
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
        <Button onClick={onCreateModalOpen} colorScheme="blue" w="387px">
          Create Room
        </Button>
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
      <Modal isOpen={isJoinModalOpen} onClose={onJoinModalClose}>
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
      <CreateRoom
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        initialRef={initialRef} // Pass the ref for input focus
      />
    </Flex>
  );
};

export default AllRooms;
