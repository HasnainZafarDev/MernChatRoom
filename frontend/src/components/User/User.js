import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@chakra-ui/react";
import "./style.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
const User = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/user/getUser");
        setUser(data.data);
      } catch (error) {}
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout");
      setUser(null)
      toast({
        title: "Logout Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      history.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="userContainer">
      <div className="userDetails">
        <Avatar bg="teal.500" />
        {user ? <h1 className="name">{user.username}</h1> : <h1>Loading...</h1>}
      </div>
      <Button colorScheme="pink" variant="solid" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default User;
