import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

const RestTimePicker = (props) => {
  let times = [1, 2, 3, 4, 5];
  const onTimeClick = (time) => {
    props.updateModal(false);
    props.updateTime(time)
    props.updateDisplayModal(true);
  }


  return (
      <Modal
        show={props.openModal}
        onHide={() => props.updateModal(false)}
        centered
        style={{ width: "90%", marginLeft: "5%" }}
      >
        <Modal.Body style={{height: "291px"}} className="popover-rest-timer-inputs">
          <Text>
            <h4>Rest Time</h4>
            <p>Choose a rest time to begin</p>
          </Text>
          <Inputs>
            {times.map(time => <button key={time} onClick={() => onTimeClick(time*60)} style={{ background: props.colour }}>{time}:00</button>
            )}
          </Inputs>
        </Modal.Body>
      </Modal>
  );
};

export default RestTimePicker;
const Inputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center !important;

  button {
    margin: 5px;
    padding: 3px 60px;
    border: none;
    border-radius: 10px;
    color: white;
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
  }
`
