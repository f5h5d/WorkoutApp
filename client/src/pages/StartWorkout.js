import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../helper/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrashCan,
  faEllipsisV,
  faHourglass,
  faRecycle,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import AddExcercise from "./Modals/AddExcercise";
import ConfirmExcerciseRemoval from "./Modals/ConfirmExcerciseRemoval";
import ExcerciseRestTimePicker from "./Modals/ExcerciseRestTimePicker";
import RestTimePicker from "./Modals/RestTimePicker";
import RestTimeDisplay from "./Modals/RestTimeDisplay";
import ConfirmWorkoutComplete from "./Modals/ConfirmWorkoutComplete";
import { useNavigate } from "react-router-dom";

let colour = "";
let popoverHoverColour = "#000";
let workoutTime = Date.now();

const StartWorkout = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const [excercises, setExcercises] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [ellipsisExcerciseID, setEllipsisExcerciseID] = useState(-1111);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [openModals, setOpenModals] = useState({
    excerciseModal: false,
    confirmExcerciseRemovalModal: false,
    excerciseRestTimePicker: false,
    restTimePicker: false,
    RestTimeDisplay: false,
    confirmWorkoutCompleteModal: false,
  });

  const minSwipeDistance = window.innerWidth - 50;

  let resetTimer = useRef(0);
  let displayResetTime = useRef(null);
  let displayWorkoutTime = useRef(null);
  let workoutTitle = useRef("");

  useEffect(() => {
    axios
      .get(
        `http://localhost:3036/workouts/getOne/${authState.currentWorkout}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (excercises.length === 0) {
          try {
            colour = response.data.colour;
            popoverHoverColour = response.data.colour;
            response.data.excercises.map((e) =>
              e.sets.map((i) => {
                i.finished = false;
                i.weight = 0;
                i.reps = 0;
                i.unit = "LBS";
              })
            );
            setExcercises(response.data.excercises);
            workoutTitle.current = response.data.title;
          } catch {}
        }
      });
  });

  useEffect(() => {
    if (timerIsRunning) {
      const intervalId = setInterval(() => {
        if (resetTimer.current > 0) {
          resetTimer.current--;
          // childRef.current.childFunction();
          if (displayResetTime.current) {
            displayResetTime.current.textContent = `${secondsToMinutes(
              resetTimer.current
            )}`;
          }
        } else {
          clearInterval(intervalId);
          setTimerIsRunning(false);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timerIsRunning]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (displayWorkoutTime.current) {
        displayWorkoutTime.current.textContent = `${secondsToMinutes(
          Math.trunc((Date.now() - workoutTime) / 1000)
        )}`;
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const checkIfNumber = (e) => {
    const regex = new RegExp(
      /(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/
    );
    return !e.key.match(regex) && e.preventDefault();
  };

  const updateExcerciseModal = (value) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      excerciseModal: value,
    }));
  };

  const updateConfirmExcerciseRemovalModal = (value) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      confirmExcerciseRemovalModal: value,
    }));
  };

  const updateExcerciseRestTimePickerModal = (value, minutes, seconds) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      excerciseRestTimePicker: value,
    }));

    if (minutes == null || seconds == null) return;
    for (let x of excercises) {
      if (x.id == ellipsisExcerciseID) {
        x.restTimer = +minutes * 60 + +seconds;
      }
    }
  };

  const updateRestTimePickerModal = (value, minutes, seconds) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      restTimePicker: value,
    }));
  };

  const updateRestTimeDisplayModal = (value) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      restTimeDisplay: value,
    }));
  };

  const updateConfirmWorkoutCompleteModal = (value) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      confirmWorkoutCompleteModal: value,
    }));
  };
  const darkenRGB = (color, amount) => {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16
            )
          ).substr(-2)
        )
    );
  };

  const addSet = (e) => {
    const excerciseId = e.target.getAttribute("data-excercise-id");
    setExcercises(
      excercises.map((e) => {
        if (e.id === excerciseId) {
          e.sets.push({
            lastWeight: 0,
            lastReps: 0,
            finished: false,
            lbs: 0,
            reps: 0,
          });
        }
        return e;
      })
    );
  };

  const toggleCompleteSet = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let row = e.target.parentElement.parentElement.parentElement;
    row = row.getAttribute("data-set-id") == null ? row.parentElement : row;
    let rowId = +row.getAttribute("data-set-id");

    let checkmarkBackground =
      e.target.firstChild !== null ? e.target : e.target.parentElement;
    const excercise =
      row.parentElement.parentElement.parentElement.firstChild.textContent;
    const test = excercises;
    test.forEach((x) => {
      if (x.name === excercise) {
        x.sets.map((i, index) => {
          if (index === rowId) {
            i.finished = !i.finished;
            if (i.finished) {
              if (!row.firstChild.children[1].value)
                row.firstChild.children[1].value = i.lastWeight;
              if (!row.firstChild.children[2].value)
                row.firstChild.children[2].value = i.lastReps;
            }
            row.classList.toggle("excercise-input-row-finish");
            row.style.background = i.finished ? colour : "";
            row.firstChild.firstChild.style.color = i.finished
              ? "#eceff1"
              : colour;
            row.firstChild.lastChild.firstChild.style.color = i.finished
              ? "#eceff1"
              : colour;
            row.firstChild.lastChild.firstChild.style.background = i.finished
              ? "#0bb538"
              : "#eceff1";
            x.sets[index].lbs =
              +checkmarkBackground.parentElement.parentElement.children[1]
                .value;
            x.sets[index].reps =
              +checkmarkBackground.parentElement.parentElement.children[2]
                .value;
          }
        });
      }
    });

    setExcercises(test);

    for (let x of excercises) {
      if (x.name == excercise) {
        if (
          row.classList.contains("excercise-input-row-finish") &&
          resetTimer.current == 0
        ) {
          resetTimer.current = x.restTimer;
          setTimerIsRunning(true);
        }
        return;
      }
    }
  };

  const finishWorkoutChecks = (e) => {
    const hasSetsLeft = excercises.some((excercise) =>
      excercise.sets.some((set) => !set.finished)
    );

    hasSetsLeft
      ? updateConfirmWorkoutCompleteModal(true)
      : finishWorkout(false);
  };

  const finishWorkout = async (hasSetsLeft) => {
    if (hasSetsLeft) {
      setExcercises(prevExcercises => 
        prevExcercises.map(excercise => ({
          ...excercise,
          sets: excercise.sets.map(set => ({
            ...set,
            finished: true 
          }))
        }))
      );
    }
      await axios
        .post(
          "http://localhost:3036/workouts/post",
          {
            title: workoutTitle.current,
            colour: colour,
            excercises: excercises,
          },
          { withCredentials: true }
        )
        .then((response) => {
          if (typeof response.data === "string") {
            return;
          }
          navigate("/workouts")
        });
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (touchStart - touchEnd < 0) {
      onTouchEnd(e);
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
    let row = e.target;
    if (!row.classList.contains("excercise-input-row"))
      row = e.target.parentElement;
    row.style.right = `${touchStart - touchEnd}px`;
    const rightValue = row.style.right.split("px")[0];
    row.parentElement.lastChild.style.left = `calc(90vw - ${rightValue}px)`;
  };

  const onTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    let row = e.target;
    if (!row.classList.contains("excercise-input-row"))
      row = e.target.parentElement;
    if (isLeftSwipe || isRightSwipe) {
      const rightValue = row.style.right.split("px")[0];
      if (rightValue > minSwipeDistance) {
        const setId = +row.parentElement.getAttribute("data-set-id");
        const excerciseName =
          row.parentElement.parentElement.parentElement.parentElement.firstChild
            .textContent;

        let test = excercises;
        excercises.filter((e, outerIndex) => {
          if (e.name === excerciseName) {
            e.sets.filter((i, innerIndex) => {
              if (innerIndex === setId) {
                test[outerIndex].sets.splice(innerIndex, 1);
                return;
              }
            });
          }
        });
        setExcercises(test);
        setTouchEnd(null);
      }
    }
    row.style.right = `0px`;
    row.parentElement.lastChild.style.left = `100vw`;
  };

  const onEllipsis = (id) => {
    setEllipsisExcerciseID(id);
  };

  const secondsToMinutes = (time = 0) => {
    // func also used for just for showing the time on the ellipsis click so yeah
    const minutes = Math.floor((time > 0 ? time : resetTimer.current) / 60);
    const secs = (time > 0 ? time : resetTimer.current) % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const updateResetTimer = () => {
    document.getElementsByClassName("timer-text")[0].textContent =
      secondsToMinutes();
  };

  const onWeightButtonClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // excercises.map((x) => {
    //   console.log(x)
    // })
    setExcercises(
      excercises.map((x) => {
        if (x.id == ellipsisExcerciseID) {
          if (x.unit == "KG") x.unit = "LBS";
          else x.unit = "KG";
        }
        return x;
      })
    );
  };

  const addExcercise = (excercise) => {
    for (let i = 0; i < excercises.length; i++) {
      if (excercises[i].id == ellipsisExcerciseID) {
        setExcercises([
          ...excercises.slice(0, i),
          excercise,
          ...excercises.slice(i + 1),
        ]);
        return;
      }
    }
    setExcercises([...excercises, excercise]);
  };

  const deleteExcercise = () => {
    for (let i = 0; i < excercises.length; i++) {
      if (excercises[i].id == ellipsisExcerciseID) {
        setExcercises([...excercises.slice(0, i), ...excercises.slice(i + 1)]);
        break;
      }
    }
    updateConfirmExcerciseRemovalModal(false);
  };

  const findRestTime = () => {
    for (let x of excercises) {
      if (x.id == ellipsisExcerciseID) {
        return secondsToMinutes(x.restTimer);
      }
    }
  };

  const findUnit = () => {
    for (let x of excercises) {
      if (x.id == ellipsisExcerciseID) {
        return x.unit;
      }
    }
  };

  // props funcs
  const getTime = () => resetTimer.current;

  const updateTime = (time) => {
    if (resetTimer.current > 0) {
      resetTimer.current = time;
      return;
    }
    resetTimer.current = time;
    setTimerIsRunning(true);
  };

  const popover = (
    <PopoverContainer>
      <Popover className="popover">
        <Popover.Body
          className="popover-body"
          style={{
            background: colour,
            color: "white",
            border: `1px solid ${darkenRGB(colour, -40)}`,
          }}
        >
          <div
            className="popover-row popover-row-hoverable"
            style={{}}
            onClick={(e) => updateExcerciseModal(true)}
          >
            <div className="popover-left-side">
              <FontAwesomeIcon className="popover-icon" icon={faRecycle} />
              <p className="popover-left-side-text">Replace Excercise</p>
            </div>
          </div>
          <div className="popover-row ">
            <div className="popover-left-side">
              <FontAwesomeIcon className="popover-icon" icon={faDumbbell} />
              <p className="popover-left-side-text">Weight Units</p>
            </div>

            <div className="popover-right-side">
              <button
                className="popover-weight-button"
                onClick={(e) => onWeightButtonClicked(e)}
                style={{
                  background: `${darkenRGB(colour, 40)}`,
                  border: `1px solid ${darkenRGB(colour, -60)}`,
                }}
              >
                {findUnit()}
              </button>
            </div>
          </div>

          <div className="popover-row">
            <div className="popover-left-side">
              <FontAwesomeIcon className="popover-icon" icon={faHourglass} />
              <p className="popover-left-side-text">Rest Timer</p>
            </div>
            <span className="popover-right-side popover-rest-timer-inputs">
              <button
                onClick={(e) => updateExcerciseRestTimePickerModal(true)}
                className="popover-timer-button"
                style={{
                  background: `${darkenRGB(colour, 40)}`,
                  border: `1px solid ${darkenRGB(colour, -60)}`,
                }}
              >
                {findRestTime()}
              </button>
            </span>
          </div>

          <div
            className="popover-row popover-row-hoverable"
            onClick={(e) => updateConfirmExcerciseRemovalModal(true)}
          >
            <div className="popover-left-side">
              <FontAwesomeIcon className="popover-icon" icon={faTrashCan} />
              <p className="popover-left-side-text">Delete Excercise</p>
            </div>
          </div>
        </Popover.Body>
      </Popover>
    </PopoverContainer>
  );

  const resetTimerHolder = (
    <button
      onClick={(e) =>
        resetTimer.current > 0
          ? updateRestTimeDisplayModal(true)
          : updateRestTimePickerModal(true)
      }
      className="nav-button btn px-1 py-1 text-center"
      style={{ background: `${colour}` }}
    >
      {" "}
      {resetTimer.current > 0 ? (
        <p ref={displayResetTime} className="timer-text">
          {secondsToMinutes()}
        </p>
      ) : (
        <FontAwesomeIcon className="reset-timer-icon" icon={faHourglass} />
      )}
    </button>
  );
  return (
    <Container>
      <Nav className="">
        <div className="">{resetTimerHolder}</div>
        <p className="workout-timer-text" ref={displayWorkoutTime}>
          0:00
        </p>
        <button
          className="nav-button btn px-1 py-1 text-center"
          style={{ background: `${colour}` }}
          onClick={finishWorkoutChecks}
        >
          FINISH
          {openModals.excerciseModal}
        </button>
      </Nav>
      <h1 className="title">{workoutTitle.current}</h1>
      <Excercises>
        {excercises.map((x) => {
          return (
            <div className="excercise" key={x.id}>
              <p className="excercise-title" style={{ color: `${colour}` }}>
                {x.name}
              </p>
              <div>
                <div className="excercise-subtitles">
                  <span className="set">SET</span>
                  <span className="lbs">{x.unit}</span>
                  <span className="reps">REPS</span>
                  <span className="invis">
                    {" "}
                    <OverlayTrigger
                      trigger="click"
                      placement="left"
                      rootClose
                      overlay={popover}
                      data-excercise-id={x.id}
                      className="test"
                    >
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        onClick={() => onEllipsis(x.id)}
                      />
                    </OverlayTrigger>
                  </span>
                </div>
                <div className="excercise-inputs">
                  {x.sets.map((e, i) => {
                    return (
                      <div
                        style={{ position: "relative" }}
                        key={i}
                        data-set-id={i}
                        className="excercise-inputs-div"
                      >
                        <span
                          className="excercise-input-row"
                          key={i}
                          onTouchStart={onTouchStart}
                          onTouchMove={onTouchMove}
                          onTouchEnd={onTouchEnd}
                        >
                          <p style={{ color: `${colour}` }}>{i + 1}</p>
                          <input
                            onKeyDown={checkIfNumber}
                            placeholder={e.lastWeight}
                          />
                          <input
                            onKeyDown={checkIfNumber}
                            placeholder={e.lastReps}
                          />
                          <span
                            className="checkmark-container"
                            onClick={toggleCompleteSet}
                          >
                            <FontAwesomeIcon
                              className="checkmark"
                              icon={faCheck}
                              style={{
                                color: `${colour}`,
                                border: `1px solid ${colour}`,
                              }}
                            />
                          </span>
                        </span>
                        <span className="remove-set">
                          <span className="trash-can">
                            <FontAwesomeIcon className="" icon={faTrashCan} />
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                className="add-set mt-2"
                data-excercise-id={x.id}
                style={{ color: `${colour}`, border: `1px solid ${colour}` }}
                onClick={(e) => addSet(e)}
              >
                ADD SET
              </button>
            </div>
          );
        })}
      </Excercises>

      <AddButton>
        <button
          style={{ background: `${colour}` }}
          onClick={() => updateExcerciseModal(true)}
          className="button add-excercise-button"
        >
          Add Excercise
        </button>
      </AddButton>
      <AddExcercise
        openModal={openModals.excerciseModal}
        updateModal={updateExcerciseModal}
        setExcercises={setExcercises}
        excercises={excercises}
        addExcercise={addExcercise}
      />

      <ConfirmExcerciseRemoval
        openModal={openModals.confirmExcerciseRemovalModal}
        updateModal={updateConfirmExcerciseRemovalModal}
        action={"Delete"}
        deleteExcercise={deleteExcercise}
      />

      <ConfirmWorkoutComplete
        openModal={openModals.confirmWorkoutCompleteModal}
        updateModal={updateConfirmWorkoutCompleteModal}
        colour={colour}
        finishWorkout={finishWorkout}
      />

      <ExcerciseRestTimePicker
        openModal={openModals.excerciseRestTimePicker}
        updateModal={updateExcerciseRestTimePickerModal}
      />

      <RestTimePicker
        openModal={openModals.restTimePicker}
        updateModal={updateRestTimePickerModal}
        updateDisplayModal={updateRestTimeDisplayModal}
        updateTime={updateTime}
        colour={colour}
      />

      <RestTimeDisplay
        openModal={openModals.restTimeDisplay}
        updateModal={updateRestTimeDisplayModal}
        throwAway={resetTimer.current}
        secondsToMinutes={secondsToMinutes}
        updateTime={updateTime}
        colour={colour}
        getTime={getTime}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #eceff1;
  overflow-x: hidden;

  .title {
    margin-top: 10vh;
    margin-left: 5vh;
  }
`;

const Nav = styled.div`
  width: 100%;
  height: 7vh;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background: #eceff1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1000;

  .finish {
    margin: 0px 10px;
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 10px;
    color: white;
    width: 100px;
    height: 34px;
  }

  .workout-timer-text {
    margin-bottom: 0px;
    font-size: 20px;
  }
  .timer-text {
    z-index: 1000;
    margin-bottom: 0px;
    display: inline;
    color: white;
  }
`;
const Excercises = styled.div`
  margin-left: 5vw;
  margin-right: 5vw;

  .excercise {
    width: 95vw;
    margin: 50px 0;

    .remove-set {
      position: absolute;
      bottom: 6px;
      background: black;
      height: 25px;
      width: 100vw;
      left: 95vw;
      background: #e74c3c;
      border-radius: 4px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .trash-can {
      margin-right: 10px;
      color: #eceff1;
      z-index: 1;
      background: transparent;
    }
    .toggle-visible {
      display: none;
    }

    .excercise-subtitles {
      width: 90vw;
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;

      .set {
        width: 10%;
        text-align: center;
      }
      .lbs,
      .reps {
        width: 33%;
        text-align: center;
      }
      .invis {
        width: 7%;
        text-align: center;
      }
    }

    .excercise-inputs-div {
      padding: 2px 0;
    }

    .excercise-input-row {
      width: 90vw;
      height: 25px;
      margin: 5px 0px;
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 10;
      p {
        text-align: center;
        width: 10%;
        color: ${colour};
      }

      input {
        width: 33%;
        border: none;
        border-radius: 4px;
        height: 25px;
        text-align: center;
        outline: none;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      span {
        width: 7%;
        z-index: 2;
        text-align: center;
      }
      .checkmark {
        padding: 4px;
        background: white;
        border-radius: 4px;
      }
    }

    .excercise-input-row-finish {
      background: ${colour} !important;
      /* padding: 2px 0; */
    }
  }

  .add-set {
    outline: none;
    border: none;
    border-radius: 4px;
    width: 95%;
    font-size: 0.8rem;
    height: 25px;
    background: white;
  }
`;

const PopoverContainer = styled.div`
  z-index: 1000;
  border-radius: 10px;

  .popover-body {
    width: 300px;
    border-radius: 7px;
  }

  .popover-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    /* padding: 5px 0px; */
  }

  .popover-row-hoverable:hover {
    opacity: 0.5;
  }
  .popover-arrow {
    display: none;
  }

  .popover-icon {
    width: 15px;
    margin: 0 10px;
  }

  .popover-left-side {
    display: inline;
  }

  .popover-left-side-text {
    display: inline;
    font-weight: 500;
    font-size: 15px;
  }

  .popover-weight-button {
    outline: none;
    border-radius: 4px;
    color: white;
    width: 35px !important;
    padding: 0 5px;
  }

  .popover-timer-button {
    outline: none;
    border-radius: 4px;
    color: white;
    width: 45px !important;
    padding: 0 5px;
  }

  .popover-rest-timer-input-minutes {
  }

  .popover-rest-timer-input-seconds {
  }

  .popover-right-side {
    margin-right: 10px;
  }

  .popover-right-side-text {
    margin-right: 2px;
    display: inline;
    font-weight: 500;
    font-size: 15px;
  }
`;

const AddButton = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  .add-excercise-button {
    height: 40px;
    border-radius: 5px;
    padding: 5px 10px;
    text-align: center;
    border: none;
    color: white;
  }
`;

export default StartWorkout;
