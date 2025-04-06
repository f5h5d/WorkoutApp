import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import AddWorkout from "./Modals/AddWorkout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import WorkoutInfo from "./Modals/WorkoutInfo";

const Workouts = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const [openModal, setopenModal] = useState(false);
  const [createWorkoutModal, setCreateWorkoutModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    color: "",
    id: "",
  });
  const [myWorkouts, setMyWorkouts] = useState([]);

  useEffect(() => {
    if (authState.loggedIn === false) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:3036/workouts/getAll", { withCredentials: true })
      .then((response) => {
        const workouts = [];
        for (let x of response.data) {
          workouts.push({
            title: x.title,
            description: x.description,
            colour: x.colour,
            id: x.id,
          });
        }
        setMyWorkouts(workouts);
      });
  }, []);

  const updateCreateWorkoutModal = (value) => {
    setCreateWorkoutModal(value);
  };

  const showModal = async (e) => {
    const card = !e.target.classList.contains("card-title")
      ? e.target.parentElement.parentElement.firstChild
      : e.target.parentElement.firstChild;

    await axios
      .get(
        `http://localhost:3036/workouts/verify/${card.parentElement.dataset.workoutid}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (!response.data) {
          document.documentElement.style.setProperty(
            "--modalColor",
            card.style.backgroundColor
          );
          setModalInfo({
            title: card.firstChild.textContent,
            color: card.style.backgroundColor,
            id: card.parentElement.dataset.workoutid,
          });
          setopenModal(true);
        }
      });
  };

  const hideModal = () => {
    setopenModal(false);
  };

  const addWorkout = async (e) => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const colour = document.getElementById("colorInput").value;

    axios
      .post(
        "http://localhost:3036/workouts/create",
        {
          title: title,
          description: description,
          colour: colour,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setMyWorkouts([
          ...myWorkouts,
          {
            title: title,
            description: description,
            colour: colour,
            id: response.data,
          },
        ]);
        updateCreateWorkoutModal(false);
      });
  };
  const editWorkout = () => {
    navigate(`/workouts/edit/${modalInfo.id}`);
  };
  return (
    <Container>
      <Header>
        <h1 className="header">
          Work
          <span className="header-span">
            outs<div className="underline"> </div>
          </span>
        </h1>
      </Header>

      <CreateNewWorkout>
        <button
          className="create-workout-button"
          onClick={() => setCreateWorkoutModal(true)}
        >
          Create A New Workout!
        </button>
      </CreateNewWorkout>

      <WorkoutGrid>
        {myWorkouts.map((workout) => {
          console.log(workout);
          return (
            <div
              className="card"
              onClick={(e) => showModal(e)}
              key={workout.id}
              data-workoutid={workout.id}
            >
              <div
                className="card-title d-flex align-items-center"
                style={{ background: `${workout.colour}` }}
              >
                <h5 style={{ color: "#ffffff" }}>{workout.title}</h5>
              </div>
              <div className="card-body">
                <p>{workout.description}</p>
              </div>
            </div>
          );
        })}
      </WorkoutGrid>

      <WorkoutInfo
        editWorkout={editWorkout}
        openModal={openModal}
        hideModal={hideModal}
        modalInfo={modalInfo}
      />
      <AddWorkout
        openModel={createWorkoutModal}
        updateCreateWorkoutModal={updateCreateWorkoutModal}
        addWorkout={addWorkout}
      />
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #eceff1;

  .modal-footer {
    display: flex;
  }

  .modal-button {
    outline: none !important;
    border: none !important;
    padding: 50px;
  }
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
    left: 205px;
    height: 20px;
    width: 170px;
    background: #ff6b81;
    border-radius: 4px;
    bottom: 12px;
  }

  @media (max-width: 400px) {
    h1 {
      font-size: 4rem;
    }
    .underline {
      left: 163px;
      width: 140px;
    }
  }
`;

const WorkoutGrid = styled.div`
  width: 90vw;
  height: auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 1rem;
  margin: 0 5vw;

  .card {
    background: #ffffff;
    outline: none;
    border: none;
    width: auto;
    min-height: 200px;
    align-self: start;
    transition: all 0.5s;
  }

  .card-title {
    height: 150px;
    width: auto;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    h5 {
      height: auto;
      width: inherit;
      margin: auto;
      text-align: center;
      font-size: 2.5rem;
      font-weight: bold;
    }
  }

  .card-body {
    margin-top: 0px;
    padding: 0px;
    text-align: center;

    p {
      font-size: 0.8rem;
    }
  }

  .front {
    z-index: 100;
    transition: all 0.5s;
  }
  .front:hover {
    transform: rotateY(180deg);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 600px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CreateNewWorkout = styled.div`
  width: 100vw;

  .create-workout-button {
    display: block;
    border: none;
    color: white;
    background: #ffa726;
    padding: 15px 25px;
    width: 90vw;
    border-radius: 20px;
    margin-left: 5vw;
    margin-bottom: 30px;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

export default Workouts;
