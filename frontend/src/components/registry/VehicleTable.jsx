import React from "react";
import "../../styles/tables.css";

function VehicleTable() {
  return (
    <div className="table-wrapper">
      <h2>Active Inventory</h2>

      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>VIN</th>
            <th>Status</th>
            <th>Mileage</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Ford Transit 250</td>
            <td>VIN-8821902</td>
            <td>Active</td>
            <td>12,450 mi</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VehicleTable;
