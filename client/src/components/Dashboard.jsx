import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const Dashboard = () => {
  const { userState } = useContext(UserContext);
  return (
    <>
      <h2>Dashboard</h2>
      <h3>Welcome {userState.user.username}</h3>
    </>
  );
};
