import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CreateRoom from "./CreateRoom";
import RoomDetails from "./RoomDetails";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isRoomOpen,
    onOpen: onRoomOpen,
    onClose: onRoomClose,
  } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const history = useHistory();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("/api/user/getUser");
        setCurrentUser(data.data);
      } catch (error) {
        console.log("🚀 ~ fetchCurrentUser ~ error:", error);
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
        console.log("🚀 ~ fetchRooms ~ error:", error);
      }
    };
    fetchRooms();
  }, [rooms]);
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    onRoomOpen();
  };
  const toChats = () => {
    history.push(`/chats`);
  };
  return (
    <div>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>
            <Button onClick={onCreateOpen} colorScheme="red">
              Create Room
            </Button>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Room Name</Th>
              <Th>Room Owner</Th>
              <Th isNumeric>Persons</Th>
              <Th isNumeric>Button</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rooms.map((room) => (
              <Tr key={room.id}>
                {" "}
                <Td>
                  <Button variant="link" onClick={() => handleRoomClick(room)}>
                    {room.name}
                  </Button>
                </Td>
                <Td>{room.creatorId.username}</Td>
                <Td isNumeric>{room.participants.length} Persons </Td>{" "}
                <Td isNumeric>
                  <Button onClick={toChats}>Join Chat</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
      <CreateRoom
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        initialRef={initialRef}
      />
      {selectedRoom && (
        <RoomDetails
          isOpen={isRoomOpen}
          onClose={onRoomClose}
          room={selectedRoom}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default AllRooms;
