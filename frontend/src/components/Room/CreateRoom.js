import React, { forwardRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
const CreateRoom = ({ isOpen, onClose, initialRef }) => {
  const [name, setName] = useState("");
  const toast = useToast();
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreateRoom();
    }
  };

  const handleCreateRoom = async () => {
    const name = initialRef.current.value;
    if (name.trim() === "") {
      toast({
        title: "Error",
        description: "Room name cannot be empty",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else {
      try {
        await axios.post("/api/room/create", {
          name,
        });
        toast({
          title: "Room Created Successfully",
          description: "You have created a new room",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setName("");
        onClose();
      } catch (error) {
        console.log("🚀 ~ handleCreateRoom ~ error:", error);
      }
    }
  };

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Room Name</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Room Name"
              onKeyDown={handleKeyDown}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateRoom}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default forwardRef(CreateRoom);
