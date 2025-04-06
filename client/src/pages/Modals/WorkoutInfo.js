import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helper/AuthContext";

const WorkoutInfo = (props) => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const [listOfExcercises, setListOfExcercises] = useState([]);
  console.log(props.modalInfo.id);

  const startWorkout = async () => {
    await axios
      .post(`http://localhost:3036/users/startWorkout/`, {
        withCredentials: true,
        email: authState.email,
        id: props.modalInfo.id,
      })
      .then((response) => {
        setAuthState({...authState, currentWorkout: props.modalInfo.id})
        navigate(`/workouts/start/${props.modalInfo.id}`);
      });
  };

  const getExcercises = async () => {
    await axios
      .get(`http://localhost:3036/workouts/getOne/${props.modalInfo.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.excercises);
        setListOfExcercises(
          response.data.excercises.map((excercise) => (
            <li key={excercise.id} className="workout-info-excercises">
              <img
                className="workout-info-excercise-image"
                src={excercise.gifUrl}
              />
              <span className="workout-info-excercise-name">
                {excercise.name}
              </span>
            </li>
          ))
        );
      });
  };
  useEffect(() => {
    if (props.modalInfo.id != "") getExcercises();
  }, [props.modalInfo]);
  return (
    <Modal show={props.openModal} onHide={props.hideModal} centered>
      <Modal.Header
        className="workout-info-modal-header"
        style={{ background: `${props.modalInfo.color}` }}
      >
        <Modal.Title className="text-center modal-header-text">
          {props.modalInfo.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="workout-info-modal-body">
        <ul className="workout-info-excercises-list">{listOfExcercises}</ul>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <button
          onClick={props.editWorkout}
          style={{
            border: "none",
            background: "#D0312D",
            padding: "10px 20px",
            borderRadius: "20px",
            color: "#ffffff",
          }}
          className="modal-button edit-button"
        >
          Edit Workout
        </button>
        <button
          style={{
            border: "none",
            background: `${props.modalInfo.color}`,
            padding: "10px 20px",
            borderRadius: "20px",
            color: "#ffffff",
          }}
          onClick={startWorkout}
        >
          Start Workout
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkoutInfo;
