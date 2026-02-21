import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/tables.css";

function TripsTable() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.getTrips({ page: 1, limit: 5 });
      if (response.success) {
        setTrips(response.data.trips || []);
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status === 'In Progress' ? 'status-active' : 'status-completed';
  };

  return (
    <div className="table-wrapper">
      <h2>Recent Trips</h2>
      <table>
        <thead>
          <tr>
            <th>Trip ID</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
            </tr>
          ) : trips.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No trips found</td>
            </tr>
          ) : (
            trips.map((trip) => (
              <tr key={trip.id}>
                <td>#{trip.id}</td>
                <td>{trip.vehicle_license_plate || 'N/A'}</td>
                <td>{trip.driver_name || 'N/A'}</td>
                <td>{trip.origin}</td>
                <td>{trip.destination}</td>
                <td className={getStatusClass(trip.status)}>{trip.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TripsTable;
