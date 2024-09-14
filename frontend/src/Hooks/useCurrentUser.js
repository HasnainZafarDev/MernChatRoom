import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/apiService";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    getUser();
  }, []);
  return currentUser;
};
export default useCurrentUser;
