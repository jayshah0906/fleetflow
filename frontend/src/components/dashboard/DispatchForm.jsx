import React from "react";
import "../../styles/forms.css";

function DispatchForm() {
  return (
    <div className="card">
      <h3>New Trip Dispatch</h3>

      <form className="form">
        <select>
          <option>Select Vehicle</option>
        </select>

        <input placeholder="Driver Name" />
        <input placeholder="Destination" type="text" />
        <input type="time" />

        <button className="primary-btn full">
          Finalize Dispatch
        </button>
      </form>
    </div>
  );
}

export default DispatchForm;
