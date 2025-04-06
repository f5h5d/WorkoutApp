import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthState, authState } = useContext(AuthContext);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    if (authState.loggedIn === true) {
      navigate("/workouts")
    }
  })

  const onSubmit = async (e) => {
    const form = e.target.parentElement.parentElement;
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    await axios
      .post(
        "http://localhost:3036/users/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (typeof response.data === "string") {
          setErrMessage(response.data);
          return;
        }
        const { data } = response;
        setAuthState({
          email: data.email,
          name: data.name,
          id: data.id,
          loggedIn: true,
        });

        navigate("/workouts")
      });
  };

  return (
    <Container>
      <Header>
        <h1 className="header">
          Log
          <span className="header-span">
            in<div className="underline"> </div>
          </span>
        </h1>
      </Header>

      <LoginForm className="form-container">
        <div className="form-box">
          <div className="input-group ">
            <div className="input-field">
              <FontAwesomeIcon className="icons" icon={faEnvelope} />
              <input type="text" id="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <FontAwesomeIcon className="icons" icon={faLock} />
              <input type="password" id="password" placeholder="Password" />
            </div>

            <div className="btn-field mt-3">
              <button type="button" id="signupBtn" onClick={onSubmit}>
                Log In
              </button>
            </div>
            <div className="error-div mt-3">
              <span>{errMessage}</span>
            </div>
          </div>
        </div>
      </LoginForm>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: #eceff1;
`;

const Header = styled.div`
  height: 20vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    margin: 0;
    font-size: 5rem;
    color: #ffa726;
    font-weight: bold;
  }

  span {
    color: #ff6b81;
  }

  .underline {
    position: relative;
    left: 137px;
    height: 20px;
    width: 80px;
    background: #ff6b81;
    border-radius: 4px;
    bottom: 12px;
  }
`;

const LoginForm = styled.div`
  height: 60vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 25vw;
    height: 50vh;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }

  .form-box {
    background: #f2f2f2 !important;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    height: 400px;
  }

  .error-div {
    width: 100%;

    span {
      text-align: center;
    }
  }
`;

export default Login;
