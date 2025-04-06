import React, { useContext } from "react";
import { AuthContext } from "../helper/AuthContext";
import axios from "axios";

const Home = () => {
  const cookieString = document.cookie;
  const { authState } = useContext(AuthContext);
  console.log(authState);
  const logout = async () => {
    await axios.get("http://localhost:3036/users/logout", {
      withCredentials: true,
    }).then(response => console.log(response))
  };
  return (
    <div className="">
      <div>{authState.email}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
