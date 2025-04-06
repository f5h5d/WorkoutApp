import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

const ExcerciseRestTimePicker = (props) => {
  let minutes;
  let seconds;
  const validateRestTimer = (e, type) => {
    if (type == "m") {
      if (e.target.value < 0) {
        e.target.value = 0;
      } else if (e.target.value > 9) {
        e.target.value = 9;
      }
      minutes = e.target.value;
    } else {
      if (e.target.value < 0) {
        e.target.value = 0;
      } else if (e.target.value > 59) {
        e.target.value = 59;
      }
      seconds = e.target.value;
    }
  };

  const checkIfNumber = (e) => {
    const regex = new RegExp(/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/);
    return !e.key.match(regex) && e.preventDefault();
  };
  
  return (
    <Modal
      show={props.openModal}
      onHide={() => props.updateModal(false, minutes, seconds)}
      centered
      style={{ width: "50%", marginLeft: "25%" }}
    >
      <Modal.Body className=" popover-rest-timer-inputs text-center">
        <Inputs>
          <input
            onBlur={(e) => validateRestTimer(e, "m")}
            className="popover-rest-timer-input popover-rest-timer-input-minutes"
            placeholder="m"
            onKeyDown={(event) => checkIfNumber(event)}
          />{" "}
          <p className="popover-rest-timer-colon">:</p>{" "}
          <input
            onBlur={(e) => validateRestTimer(e, "s")}
            className="popover-rest-timer-input popover-rest-timer-input-seconds"
            placeholder="s"
            onKeyDown={(e) => checkIfNumber(e)}
          />
        </Inputs>
      </Modal.Body>
    </Modal>
  );
};

export default ExcerciseRestTimePicker;

const Inputs = styled.div`
  .popover-rest-timer-inputs {
    /* display: flex; */
  }

  .popover-rest-timer-input {
    margin: 0 3px;
    width: 25px !important;
    outline: none;
    border: none;
    border-radius: 25%;
    text-align: center;
  }

  p {
    display: inline;
  }
`;
