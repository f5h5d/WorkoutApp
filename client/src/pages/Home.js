import React, { useContext } from 'react'
import { AuthContext } from "../helper/AuthContext";

const Home = () => {
  const cookieString = document.cookie;
  console.log(cookieString)
  const { authState } = useContext(AuthContext);
  return (
    <div>{authState.email}</div>
  )
}

export default Home