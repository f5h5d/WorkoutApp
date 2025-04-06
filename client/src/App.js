import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import EditAWorkout from "./pages/EditAWorkout";
import StartWorkout from "./pages/StartWorkout";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { AuthContext } from "./helper/AuthContext";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    email: "",
    name: "",
    id: "",
    loggedIn: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3036/users/authenticate", {
        withCredentials: true,
      })
      .then((response) => {
        const { data } = response;
        console.log(data)
        if (data.email !== undefined) {
          setAuthState({
            email: data.email,
            name: data.name,
            id: data.id,
            loggedIn: true,
            currentWorkout: data.currentWorkoutId
          });
        }
      });
  }, []);
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Routes>
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/" exact element={<Home />} />
            <Route path="/workouts" exact element={<Workouts />} />
            <Route path="/workouts/start/:id" exact element={<StartWorkout />} />
            <Route path="/workouts/edit/:id" exact element={<EditAWorkout />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
