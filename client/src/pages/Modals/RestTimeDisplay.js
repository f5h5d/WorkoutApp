import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import React, {useState, useEffect} from "react";

const RestTimeDisplay = (props) => {
  const [currentTime, setCurrentTime] = useState(props.throwAway)


  useEffect(() => {
    if (props.openModal) {
      const interval = setInterval(() => {
        props.getTime()
        setCurrentTime(currentTime - 1);
      }, 10)

      return () => clearInterval(interval); // Cleanup on unmount
    }
  })

  const onEditTime = (time) => {
    (time == 0) ? props.updateTime(0) : props.updateTime(Math.max(props.getTime() + time, 0))
    if (props.getTime() == 0) props.updateModal(false)
  }
  return (
    <Modal
      show={props.openModal}
      onHide={() => props.updateModal(false)}
      centered
      style={{ width: "90%", marginLeft: "5%" }}
    >
      <Modal.Body
        style={{ height: "291px" }}
        className=" popover-rest-timer-inputs"
      >
        <Text>
          <h4>Rest Time</h4>
          <p>Adjust the duration using the +/- buttons.</p>
        </Text>
        <Time>
          <h1>{props.secondsToMinutes(props.getTime())}</h1>
        </Time>
        <Buttons>
          <button onClick={() => onEditTime(-15)} className="back-fifteen-button">-15s</button>
          <button onClick={() => onEditTime(0)} className="skip-button" style={{ background: props.colour }}>
            Skip
          </button>
          <button onClick={() => onEditTime(15)} className="forward-fifteen-button">15s</button>
        </Buttons>
      </Modal.Body>
    </Modal>
  );
};

export default RestTimeDisplay;
const Time = styled.div`
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    display: inline;
    font-weight: bold;
    font-size: 60px;
  }
`;

const Text = styled.div`
  text-align: center;
  h4 {
    font-size: 20px;
    margin-bottom: 1px;
  }

  p {
    font-size: 12px;
    margin-bottom: 0px;
  }
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  button {
    padding: 3px 30px;
    border: none;
    border-radius: 4px;
  }

  .skip-button {
    color: white;
  }
`;
