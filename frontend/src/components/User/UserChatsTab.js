import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { MdCheckCircle } from "react-icons/md";
import UserChats from "./UserChats"; // You may need to create this component

const UserChatsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/user");
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const { data } = await axios.get(`/api/messages/private/${selectedUser._id}`);
          setMessages(data.data);
        } catch (error) {
          console.error("Error fetching messages:", error.message);
          toast({
            title: "Error fetching messages",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post("/api/messages/sendtouser", {
        recipientId: selectedUser._id,
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
      handleSendMessage();
    }
  };

  return (
    <Flex height="100vh">
      {/* Left Side (User List) */}
      <Box width="30%" bg="gray.100" p={4} overflowY="auto">
        <Heading size="md">Users</Heading>
        {users.map((user) => (
          <Box
            key={user._id}
            p={3}
            my={2}
            bg="white"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
            onClick={() => handleUserClick(user)}
          >
            <Text fontWeight="bold">{user.username}</Text>
          </Box>
        ))}
      </Box>

      {/* Right Side (Selected User Chat) */}
      <Box flex="1" bg="white" p={4} display="flex" flexDirection="column">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <Box
              p={4}
              bg="gray.200"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid gray"
            >
              <Heading size="md">{selectedUser.username}</Heading>
            </Box>

            {/* Chat Content */}
            <UserChats messages={messages} currentUser={currentUser} /> 

            {/* Chat Input */}
            <FormControl mt={4} display="flex">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Tooltip
                label="Send message"
                placement="top"
              >
                <Button
                  ml={2}
                  colorScheme="blue"
                  onClick={handleSendMessage}
                >
                  Send
                </Button>
              </Tooltip>
            </FormControl>
          </>
        ) : (
          <Text>Select a user to chat with</Text>
        )}
      </Box>
    </Flex>
  );
};

export default UserChatsPage;
