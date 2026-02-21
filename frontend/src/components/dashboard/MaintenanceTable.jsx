import React from "react";
import "../../styles/tables.css";

function MaintenanceTable() {
  return (
    <div className="table-wrapper">
      <h2>Maintenance Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Unit</th>
            <th>Service</th>
            <th>Status</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FL-1002</td>
            <td>Engine Diagnostics</td>
            <td>Completed</td>
            <td>$450</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceTable;
