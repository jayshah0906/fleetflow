import React from "react";
import "../../styles/cards.css";

function DriverCard({ name, score }) {
  return (
    <div className="driver-card">
      <div className="driver-header">
        <div className="avatar large">{name[0]}</div>
        <div>
          <h4>{name}</h4>
          <p>Route Assignment</p>
        </div>
        <span className="score">{score}</span>
      </div>

      <button className="secondary-btn full">
        FULL PERFORMANCE DATA
      </button>
    </div>
  );
}

export default DriverCard;
