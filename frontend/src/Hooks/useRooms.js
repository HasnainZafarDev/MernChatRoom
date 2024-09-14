import { useState, useEffect } from "react";
import { fetchRooms } from "../utils/apiService";

const useRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const fetchedRooms = await fetchRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    getRooms();
  }, [rooms]);
  return {rooms,setRooms}
};

export default useRooms;
