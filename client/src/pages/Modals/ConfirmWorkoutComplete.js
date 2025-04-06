import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

const ConfirmWorkoutComplete = (props) => {
  return (
    <Container>
      <Modal
        show={props.openModal}
        onHide={() => props.updateModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <div className="mb-3 fs-5">
            <b>You Have Uncompleted Sets!</b>
          </div>
          You have sets that you have not marked as complete. Uncompleted sets will be given previous values and marked as complete. Are you sure you want to finish workout.
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
          <Button
            variant="secondary"
            className="button px-5"
            onClick={() => props.updateModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{background: `${props.colour}`, border: "none"}}
            className="button px-5"
            onClick={() => props.finishWorkout(true)}
          >
            Complete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  .modal-footer {
    display: flex;
    justify-content: center !important;
  }
`;

export default ConfirmWorkoutComplete;
