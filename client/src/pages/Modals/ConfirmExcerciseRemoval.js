import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

const ConfirmExcerciseRemoval = (props) => {
  return (
    <Container>
      <Modal
        show={props.openModal}
        onHide={() => props.updateModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <div className="mb-3 fs-5">
            <b>{props.action} Excercise?</b>
          </div>
          This will remove this excercise along with all of the sets. This action can not be undone!.{" "}
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
            variant="danger"
            className="button px-5"
            onClick={() => props.deleteExcercise()}
          >
            Delete
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

export default ConfirmExcerciseRemoval;
