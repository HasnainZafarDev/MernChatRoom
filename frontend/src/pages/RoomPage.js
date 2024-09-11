import React from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import User from "../components/User/User";
import AllRooms from "../components/Room/AllRooms";

const RoomPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="1500px"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          <User />
        </Text>
      </Box>
      <Box bg="white" w="1500px" p={3} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="unstyled">
          <TabList>
            <Tab _selected={{ color: "white", bg: "blue.500" }}>
              Available Rooms
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AllRooms />
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default RoomPage;
