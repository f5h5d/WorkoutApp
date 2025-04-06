import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const UpdatedWorkout = () => {
  return (
    <Test>
      <Container className="updated-modal modal show">
        <Modal.Dialog className="updated-modal-div">
          <Modal.Body className="text-center modal-body updated-modal-body">
            <div className="icon-container">
              <FontAwesomeIcon className="icons" icon={faCheck} />
              <div className="blob-animation"></div>
            </div>
            <p>Successfully Updated</p>
          </Modal.Body>
        </Modal.Dialog>
      </Container>
    </Test>
  );
};

const Test = styled.div`
  .display {
    animation: display 1.5s;
  }
  @keyframes display {
    0% {
      visibility: visible;
    }
    25% {
      visibility: visible;
    }
    75% {
      visibility: visible;
    }
    100% {
      visibility: visible;
    }
  }
`;
const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0, 0, 0, 0.5);
  visibility: hidden;

  .modal-content {
    position: relative;
  }

  .modal-body {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .icon-container {
    height: 40px;
    width: 40px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    background: #eceff1;
    margin-bottom: 10px;
  }
  .icons {
    font-size: 35px;
    color: white;
    font-weight: bold;
    z-index: 100000;
    position: absolute;
    right: 4px;
    top: 3px;
  }

  .blob-animation {
    position: absolute;
    width: 75px;
    height: 75px;
    background: #00b894;
    border-radius: 40%;
    right: -20px;
    top: -20px;
    z-index: 0;
  }

  .fill {
    animation: fill 1.5s ease-in-out;
  }

  .move-up {
    animation: moveUp 1s;
  }

  @keyframes fill {
    from {
      top: 50px;
      transform: rotate(0deg);
    }
    to {
      top: -20px;
      transform: rotate(360deg);
    }
  }

  @keyframes moveUp {
    from {
      top: 50px;
    }
    to {
      top: 0px;
    }
  }
`;

export default UpdatedWorkout;
