import React, { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";

const RoomChats = ({ messages, currentUser }) => {
  const chatBoxRef = useRef(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  

  return (
    <Box flex="1" p={4} overflowY="auto" height="300px" ref={chatBoxRef}>
      {messages.length > 0 ? (
        messages.map((message) => {
          const isCurrentUser =
            message.sender._id === currentUser._id ||
            message.sender === currentUser._id;

          return (
            <Box
              key={message._id}
              mb={4}
              display="flex"
              justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
            >
              <Box
                bg={isCurrentUser ? "blue.500" : "gray.300"}
                color={isCurrentUser ? "white" : "black"}
                p={3}
                borderRadius="md"
                maxWidth="70%"
                boxShadow="md"
              >
                {!isCurrentUser && (
                  <Text fontWeight="bold" mb={1}>
                    {message.sender.username || currentUser.username}{" "}
                  </Text>
                )}
                <Text>{message.content}</Text>
              </Box>
            </Box>
          );
        })
      ) : (
        <Text textAlign="center" color="gray.600">
          No messages in this room yet.
        </Text>
      )}
    </Box>
  );
};

export default RoomChats;
