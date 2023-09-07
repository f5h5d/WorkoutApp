import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { AuthContext } from "./helper/AuthContext";

function App() {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
    name: "",
    id: "",
    loggedIn: false,
  });
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Routes>
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/" exact element={<Home />} />
            <Route path="/workouts" exact element={<Workouts />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
