import React from "react";
import styled from "styled-components"

const Workouts = () => {
  return (
    <Header>
      <h1>
        Sign{" "}
        <span>
          Up<div className="underline"> </div>
        </span>
      </h1>
    </Header>
  );
};


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
    left: 137px;
    height: 20px;
    width: 80px;
    background: #ff6b81;
    border-radius: 4px;
    bottom: 12px;
  }
`;

export default Workouts;
