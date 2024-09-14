import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

const UserChats = ({ messages, currentUser }) => {
  
  return (
    <Box flex="1" p={4} overflowY="auto" bg="gray.50">
      {messages.length == 0 ? (
        <Text>No messages yet.</Text>
      ) : (
        messages.map((message) => {
          return (
            <Flex
              key={message._id}
              direction={
                message.senderId == currentUser._id ? "row-reverse" : "row"
              }
              mb={2}
              align="center"
              justify={
                message.sender == currentUser._id ? "flex-end" : "flex-start "
              }
            >
              <Box
                p={3}
                borderRadius="md"
                bg={
                  message.sender == currentUser._id
                    ? "blue.200"
                    : "gray.200"
                }
                maxWidth="70%"
                wordBreak="break-word"
                shadow="md"
              >
                <Text color="black">{message.content}</Text>
              </Box>
            </Flex>
          );
        })
      )}
    </Box>
  );
};

export default UserChats;
