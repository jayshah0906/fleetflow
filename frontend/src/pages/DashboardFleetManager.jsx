import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import api from "../services/api";
import "../styles/dashboard.css";

function DashboardFleetManager() {
  const [kpis, setKpis] = useState({
    total_vehicles: 0,
    maintenance_alerts: 0,
    utilization_rate: 0,
    active_drivers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const response = await api.getDashboardKPIs();
      if (response.success) {
        setKpis(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Fleet Manager Dashboard</h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
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
                Total Vehicles
              </h3>
              <p style={{ color: '#007bff', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
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
              <h3 style={{ color: '#dc3545', fontSize: '16px', marginBottom: '10px' }}>
                Maintenance Alerts
              </h3>
              <p style={{ color: '#dc3545', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : kpis.maintenance_alerts || 0}
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
                Utilization Rate
              </h3>
              <p style={{ color: '#28a745', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : `${Math.round(kpis.utilization_rate || 0)}%`}
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
                Active Drivers
              </h3>
              <p style={{ color: '#6f42c1', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : kpis.active_drivers || 0}
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#004085', marginBottom: '10px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/vehicle-registry" style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px'
              }}>
                Manage Vehicles
              </Link>
              <Link to="/driver-management" style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px'
              }}>
                Manage Drivers
              </Link>
              <Link to="/maintenance" style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px'
              }}>
                View Maintenance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardFleetManager;
