import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faGhost,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import "./modals.css";

const AddExcercise = (props) => {

  console.log(props)
  const [listOfExcercises, setListOfExcercises] = useState([]);
  const nameOfExcercises = props.excercises.map((excercise) => excercise.name);

  const getExcercises = (e) => {
    console.log(e.target.value);
    if (e.code === "Enter" && e.target.value !== "") {
      axios
        .get(`http://localhost:3036/excercises/`, {
          withCredentials: true,
          params: { name: e.target.value.toLowerCase() },
        })
        .then((response) => {
          for (let x of response.data) {
            x.name = x.name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          console.log(response.data.length);
          setListOfExcercises(response.data.length > 0 ? response.data : [{}]);
        });
    }
  };

  return (
    <Modal
      show={props.openModal}
      onHide={() => props.updateModal(false)}
      centered
    >
      <Modal.Header
        className="modal-header d-flex justify-content-center"
        style={{ borderBottom: "none" }}
      >
        <Modal.Title
          className="text-center modal-header-text"
          style={{
            color: "#333333",
            fontSize: "2rem",
            textTransform: "none",
            width: "100%",
          }}
        >
          <Search>
            <div className="input-field">
              <FontAwesomeIcon className="icons" icon={faMagnifyingGlass} />
              <input
                type="text"
                id="excercise"
                placeholder="Excercise"
                onKeyUp={getExcercises}
              />
            </div>
          </Search>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-excercise-modal-body">
        {listOfExcercises.map((excercise) => {
          console.log(Object.keys(excercise).length);
          if (Object.keys(excercise).length !== 0) {
            if (!nameOfExcercises.includes(excercise.name)) {
              return (
                <li className="add-excercise-list" key={excercise.id}>
                  {excercise.name}
                  <FontAwesomeIcon
                    className="ml-3 plus-icon"
                    icon={faPlus}
                    onClick={() =>
                      props.addExcercise({
                        ...excercise,
                        sets: [{ lastWeight: 0, lastReps: 0 }],
                        restTimer: 120,
                        unit: "LBS"
                      })
                    }
                  />
                </li>
              );
            }
          } else {
            return (
              <div key={0}>
                <div className="ghost-container d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    className="ml-3 ghost-icon"
                    icon={faGhost}
                    style={{ fontSize: "12rem", color: "white" }}
                  />
                </div>
                <p className="text-center mt-1">No Result For Your Search! </p>
              </div>
            );
          }
        })}
      </Modal.Body>
    </Modal>
  );
};

const Search = styled.div`
  .input-field {
    border-radius: 20px;
    height: 50px;
    font-size: 1rem;
  }
`;

const NoResults = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  p {
    font-size: 2rem;
  }
`;
export default AddExcercise;
