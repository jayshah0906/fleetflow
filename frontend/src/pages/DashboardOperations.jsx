import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import "../styles/dashboard.css";

function DashboardOperations() {
  const [kpis, setKpis] = useState({
    pending_trips: 0,
    total_vehicles: 0,
    utilization_rate: 0
  });
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, tripsRes, vehiclesRes] = await Promise.all([
        api.getDashboardKPIs(),
        api.getTrips({ page: 1, limit: 5 }),
        api.getVehicles({ page: 1, limit: 10 })
      ]);

      if (kpisRes.success) {
        setKpis(kpisRes.data);
      }

      if (tripsRes.success) {
        setTrips(tripsRes.data.trips || []);
      }

      if (vehiclesRes.success) {
        setVehicles(vehiclesRes.data.vehicles || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Operations Dashboard</h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', fontSize: '16px', marginBottom: '10px' }}>
                Pending Trips
              </h3>
              <p style={{ color: '#007bff', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : kpis.pending_trips || 0}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '10px' }}>
                Active Vehicles
              </h3>
              <p style={{ color: '#28a745', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : kpis.total_vehicles || 0}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#6f42c1', fontSize: '16px', marginBottom: '10px' }}>
                Utilization
              </h3>
              <p style={{ color: '#6f42c1', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : `${Math.round(kpis.utilization_rate || 0)}%`}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {/* Recent Trips */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              padding: '20px'
            }}>
              <h2 style={{ marginBottom: '15px', fontSize: '18px' }}>Recent Trips</h2>
              {loading ? (
                <p>Loading...</p>
              ) : trips.length === 0 ? (
                <p style={{ color: '#6c757d' }}>No trips found</p>
              ) : (
                <div>
                  {trips.map(trip => (
                    <div key={trip.id} style={{
                      padding: '10px',
                      borderBottom: '1px solid #dee2e6',
                      marginBottom: '10px'
                    }}>
                      <div style={{ fontWeight: '600' }}>Trip #{trip.id}</div>
                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                        {trip.origin} → {trip.destination}
                      </div>
                      <div style={{ fontSize: '12px', color: trip.status === 'Completed' ? '#28a745' : '#007bff' }}>
                        {trip.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Status */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              padding: '20px'
            }}>
              <h2 style={{ marginBottom: '15px', fontSize: '18px' }}>Vehicle Status</h2>
              {loading ? (
                <p>Loading...</p>
              ) : vehicles.length === 0 ? (
                <p style={{ color: '#6c757d' }}>No vehicles found</p>
              ) : (
                <div>
                  {vehicles.slice(0, 5).map(vehicle => (
                    <div key={vehicle.id} style={{
                      padding: '10px',
                      borderBottom: '1px solid #dee2e6',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{vehicle.license_plate}</div>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                          Capacity: {vehicle.max_capacity_kg} kg
                        </div>
                      </div>
                      <div style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: vehicle.status === 'Available' ? '#d4edda' : '#fff3cd',
                        color: vehicle.status === 'Available' ? '#155724' : '#856404'
                      }}>
                        {vehicle.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOperations;
