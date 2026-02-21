import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDispatcher from "../components/layout/SidebarDispatcher";
import api from "../services/api";
import "../styles/dashboard.css";

function DashboardDispatcher() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState({
    pending_trips: 0,
    active_drivers: 0,
    total_vehicles: 0
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, tripsRes] = await Promise.all([
        api.getDashboardKPIs(),
        api.getTrips({ page: 1, limit: 10 })
      ]);

      if (kpisRes.success) {
        setKpis(kpisRes.data);
      }

      if (tripsRes.success) {
        setTrips(tripsRes.data.trips || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <SidebarDispatcher />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Dispatcher Dashboard</h1>

          {/* KPI Cards */}
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
                Active Drivers
              </h3>
              <p style={{ color: '#28a745', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : kpis.active_drivers || 0}
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
                Available Vehicles
              </h3>
              <p style={{ color: '#6f42c1', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : kpis.total_vehicles || 0}
              </p>
            </div>
          </div>

          {/* Create New Trip Button */}
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => navigate('/new-trip')}
              style={{
                padding: '15px 30px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              + Create New Trip
            </button>
          </div>

          {/* Recent Trips Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden'
          }}>
            <h2 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #dee2e6' }}>
              Recent Trips
            </h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Trip ID
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Driver
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Vehicle
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Origin
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Destination
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                      Loading trips...
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                      No trips found. Create your first trip!
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px' }}>#{trip.id}</td>
                      <td style={{ padding: '15px' }}>{trip.driver_name || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>{trip.vehicle_license_plate || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>{trip.origin}</td>
                      <td style={{ padding: '15px' }}>{trip.destination}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          color: trip.status === 'Completed' ? '#28a745' : '#007bff',
                          fontWeight: '600'
                        }}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDispatcher;
