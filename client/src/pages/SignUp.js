import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../helper/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const emailCheck =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordCheck = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const { setAuthState, authState } = useContext(AuthContext);
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.loggedIn === true) {
      navigate("/workouts")
    }
  })

  const onSubmit = async (e) => {
    const form = e.target.parentElement.parentElement;
    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    if (name === "") {
      setErrMessage("Name field cannot be empty!");
      return;
    }

    if (emailCheck.test(email)) {
      if (passwordCheck.test(password)) {
        await axios
          .post("http://localhost:3036/users/signup", {
            name: name,
            email: email,
            password: password
          })
          .then((response) => {
            setErrMessage(response.data);
          })


      } else {
        setErrMessage(
          "Invalid Password, minimum 8 characters, a letter, and a number! "
        );
      }
    } else {
      setErrMessage("Invalid Email!");
    }
  };
  return (
    <Container>
      <Header>
        <h1 className="header">
          Sign{" "}
          <span className="header-span">
            Up<div className="underline"> </div>
          </span>
        </h1>
      </Header>

      <SignUpForm className="form-container">
        <div className="form-box">
          <div class="input-group ">
            <div class="input-field mt-5" id="name-field">
              <FontAwesomeIcon className="icons" icon={faHouse} />
              <input type="text" id="name" placeholder="Full Name" />
            </div>
            <div class="input-field">
              <FontAwesomeIcon className="icons" icon={faEnvelope} />
              <input type="text" id="email" placeholder="Email" />
            </div>
            <div class="input-field">
              <FontAwesomeIcon className="icons" icon={faLock} />
              <input type="password" id="password" placeholder="Password" />
            </div>

            <div class="btn-field mt-3">
              <button type="button" id="signupBtn" onClick={onSubmit}>
                Sign Up
              </button>
            </div>
            <div className="error-div mt-3">
              <span>{errMessage}</span>
            </div>
          </div>
        </div>
      </SignUpForm>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
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
    left: 180px;
    height: 20px;
    width: 130px;
    background: #ff6b81;
    border-radius: 4px;
    bottom: 12px;
  }
`;

const SignUpForm = styled.div`
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
    height: 500px;
  }

  .error-div {
    width: 100%;

    span {
      text-align: center;
    }
  }
`;

export default SignUp;
