import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  List,
  ListIcon,
  ListItem,
  Heading,
  Box,
  useToast,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import axios from "axios";

const RoomDetails = ({ isOpen, onClose, room, currentUser }) => {
  const toast = useToast();

  const isParticipant = room?.participants.some(
    (participant) => participant._id === currentUser._id
  );

  const handleJoinRoom = async () => {
    try {
      await axios.post("/api/room/join", { roomId: room._id });
      toast({
        title: "You Joined The Room",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error While Joining The Room",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await axios.post("/api/room/leave", { roomId: room._id });
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
      await axios.delete("/api/room", { data: { roomId: room._id } });
      toast({
        title: "The Room is Destroyed",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch (error) {
      if (error.message === "Request failed with status code 500") {
        toast({
          title: "You Are Not The Owner",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Something Went Wrong the Room",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
    >
      <ModalOverlay bg="blackAlpha.100" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader>{room?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size="1xl">Owner: {room?.creatorId?.username}</Heading>
          <Text>
            Participants:
            {room.participants.length > 1 ? (
              room?.participants?.map((participant) => (
                <List>
                  <ListItem>
                    <Text key={participant._id}>
                      <ListIcon as={MdCheckCircle} color="green.500" />
                      {participant.username}
                    </Text>
                  </ListItem>
                </List>
              ))
            ) : (
              <Box display="flex" alignItems="center">
                <MdCheckCircle color="red" />
                <Text ml={2}>Room Is Empty</Text>
              </Box>
            )}
          </Text>
          <Box display="flex" flexDirection="column" mt={3}>
            {isParticipant ? (
              <>
                <Button colorScheme="blue" mt={2} onClick={handleLeaveRoom}>
                  Leave Room
                </Button>
                <Button colorScheme="red" mt={2} onClick={handleDeleteRoom}>
                  Delete Room
                </Button>
              </>
            ) : (
              <>
                <Button colorScheme="green" mt={2} onClick={handleJoinRoom}>
                  Join Room
                </Button>
                <Button colorScheme="red" mt={2} onClick={handleDeleteRoom}>
                  Delete Room
                </Button>
              </>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoomDetails;
