import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";
import User from "../components/User/User";

const ChatPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="1705px"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          <User />
        </Text>
      </Box>
    </Container>
  );
};

export default ChatPage;
