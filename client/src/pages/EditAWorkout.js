import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AddExcercise from "./Modals/AddExcercise";
import UpdatedWorkout from "./Modals/UpdatedWorkout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function EditAWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [excercises, setExcercises] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const nameOfExcercises = ""; // CHANGED THIS FROM   const nameOfExcercises = 

  useEffect(() => {
    axios
      .get(`http://localhost:3036/workouts/getOne/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setExcercises(response.data.excercises);
      });
  }, []);

  const updateWorkout = async (e) => {
    if (e.target.classList.contains("update")) {
      await axios
        .put(
          `http://localhost:3036/workouts/update/`,
          {
            excerciseList: excercises,
            id: id,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          e.target.classList.toggle("update")
          document.getElementsByClassName("updated-modal")[0].classList.toggle("display");
          document.getElementsByClassName("updated-modal-div")[0].classList.toggle("move-up");
          document.getElementsByClassName("blob-animation")[0].classList.toggle("fill");

          setTimeout(() => {
            document.getElementsByClassName("updated-modal")[0].classList.toggle("display");
            document.getElementsByClassName("updated-modal-div")[0].classList.toggle("move-up");
            document.getElementsByClassName("blob-animation")[0].classList.toggle("fill");
          }, 2000)
        });
    }
  };


  const removeExcercise = async (excerciseId) => {
    console.log("delte!")
    setExcercises(excercises.filter(({ id }) => {
      console.log(id, excerciseId); 
      return id !== excerciseId
    }));
    document.getElementsByClassName("update-button")[0].classList.add("update");
  };

  const addExcercise = (excercise) => {
    console.log(excercise)
    setExcercises([...excercises, excercise]);
    console.log(excercises)
    document.getElementsByClassName("update-button")[0].classList.add("update");
  };

  const deleteWorkout = async () => {
    await axios.delete(`http://localhost:3036/workouts/delete/${id}`, {
      withCredentials: true,
    }).then(response => {
      navigate("/workouts")
      console.log(response)
    })
  };

  const updateModal = (value) => {
    setopenModal(value);
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(excercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setExcercises(items);
    document.getElementsByClassName("update-button")[0].classList.add("update");
  }

  const showModal = (e) => {
    setopenModal(true);
  };

  return (
    <Container>
      <Header>
        <h1 className="header">
          Edit{" "}
          <span className="header-span">
            Workout<div className="underline"> </div>
          </span>
        </h1>
      </Header>
      <AddExcercises className="mb-3">
        <button onClick={showModal}>Add Excercises</button>
      </AddExcercises>

      <Excercises>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="excercises">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {excercises.map((excercise, index) => {
                  return (
                    <Draggable
                      key={excercise.id}
                      draggableId={excercise.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {excercise.name}{" "}
                          <FontAwesomeIcon
                            className="trash-can"
                            icon={faTrashCan}
                            onClick={() => removeExcercise(excercise.id)}
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </Excercises>
      <div className="update-button-container">
        <button
          className="delete-workout-button"
          onClick={(e) => deleteWorkout(e)}
        >
          Delete
        </button>
        <button className="update-button" onClick={(e) => updateWorkout(e)}>
          Update
        </button>
      </div>
      <AddExcercise
        openModel={openModal}
        updateModal={updateModal}
        setExcercises={setExcercises}
        excercises={excercises}
        addExcercise={addExcercise}
      />

      <UpdatedWorkout />
    </Container>
  );
}

export default EditAWorkout;

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

  .underline {
    left: 180px;
    height: 20px;
    width: 320px;
    bottom: 12px;
  }

  @media (max-width: 720px) {
    .header {
      font-size: 3.5rem;
    }
    .underline {
      left: 120px;
      height: 20px;
      width: 235px;
      bottom: 12px;
    }
  }
`;

const Excercises = styled.div`
  width: 90vw;
  margin-left: 5vw;
  border-radius: 5px;

  ul {
    padding: 0;
  }

  li {
    list-style: none;
    padding: 15px 15px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;

    path {
      color: #d0312d;
    }
  }
`;

const AddExcercises = styled.div`
  width: 100vw;
  text-align: center;
  button {
    outline: none;
    border: none;
    background: #ff6b81;
    color: white;
    padding: 5px 15px;
    border-radius: 4px;
  }
`;
