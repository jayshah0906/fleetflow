import React from "react";
import "../../styles/tables.css";

function TripsTable() {
  return (
    <div className="table-wrapper">
      <h2>Recent Trips</h2>
      <table>
        <thead>
          <tr>
            <th>Trip ID</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#TR-102</td>
            <td>Freightliner M2</td>
            <td>John Doe</td>
            <td className="status">IN TRANSIT</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TripsTable;
