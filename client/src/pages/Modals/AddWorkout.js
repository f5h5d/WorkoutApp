import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";


const AddWorkout = (props) => {
  // const [listOfExcercises, setListOfExcercises] = useState({});
  // const getExcercises = (e) => {
  //   if (e.code === "Enter" && e.target.value !== "") {
  //     axios
  //       .get(`http://localhost:3036/excercises/`, {
  //         withCredentials: true,
  //         params: { name: e.target.value },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //       });
  //   }
  // };


  return (
    <Modal
      show={props.openModel}
      onHide={() => props.updateCreateWorkoutModal(false)}
      centered
    >
      <Modal.Header
        className="modal-header d-flex"
        style={{ justifyContent: "center" }}
      >
        <Modal.Title
          className="text-center modal-header-text"
          style={{ color: "#333333", fontSize: "2rem", textTransform: "none" }}
        >
          Create A Workout!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group" style={{height: "auto"}}>
          <div className="input-field" style={{ height: "50px" }}>
            <FontAwesomeIcon className="icons" icon={faSignature} />
            <input
              type="text"
              id="title"
              placeholder="Workout Name"
              autoComplete="off"
              maxLength="40"
            />
          </div>
            <Form.Control as="textarea" rows={3}
              id="description"
              placeholder="Workout Description"
              autoComplete="off"
              style={{background:"#eaeaea", width: "100%"}}
              className="mb-4 mt-3"
              maxLength="100"
            />
        </div>
        <div className="d-flex justify-content-start align-items-center">
          <label style={{ marginRight: "10px" }}>Pick A Theme: </label>
          <Form.Control
            type="color"
            id="colorInput"
            defaultValue="#ffffff"
            title="Choose your color"
            style={{ display: "inline-block" }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <button
          onClick={() => props.updateCreateWorkoutModal(false)}
          style={{
            border: "none",
            background: "#D0312D",
            padding: "10px 20px",
            borderRadius: "20px",
            color: "#ffffff",
          }}
          className="modal-button edit-button"
        >
          Cancel
        </button>
        <button
          style={{
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            color: "#ffffff",
            background: "#00B894",
          }}
          onClick={(e) => props.addWorkout(e)}
        >
          Create
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddWorkout;
