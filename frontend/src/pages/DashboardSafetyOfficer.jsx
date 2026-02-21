import React, { useState, useEffect } from "react";
import SidebarSafetyOfficer from "../components/layout/SidebarSafetyOfficer";
import api from "../services/api";
import "../styles/dashboard.css";

function DashboardSafetyOfficer() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    avgSafetyScore: 0,
    expiringLicenses: 0
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await api.getDrivers({ page: 1, limit: 100 });
      if (response.success) {
        const driversList = response.data.drivers || [];
        setDrivers(driversList);

        // Calculate stats
        const total = driversList.length;
        const avgScore = total > 0 
          ? driversList.reduce((sum, d) => sum + (d.safety_score || 0), 0) / total 
          : 0;
        
        const expiring = driversList.filter(d => {
          if (!d.license_expiry) return false;
          const expiry = new Date(d.license_expiry);
          const today = new Date();
          const daysUntil = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30 && daysUntil >= 0;
        }).length;

        setStats({
          totalDrivers: total,
          avgSafetyScore: Math.round(avgScore),
          expiringLicenses: expiring
        });
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 75) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="app-layout">
      <SidebarSafetyOfficer />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Safety Officer Dashboard</h1>

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
                Total Drivers
              </h3>
              <p style={{ color: '#007bff', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : stats.totalDrivers}
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
                Avg Safety Score
              </h3>
              <p style={{ color: '#28a745', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : stats.avgSafetyScore}/100
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
                Expiring Licenses
              </h3>
              <p style={{ color: '#dc3545', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : stats.expiringLicenses}
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden'
          }}>
            <h2 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #dee2e6' }}>
              Driver Safety Scores
            </h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Driver Name
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    License Number
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    License Expiry
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Safety Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                      Loading drivers...
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                      No drivers found
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px' }}>{driver.name}</td>
                      <td style={{ padding: '15px' }}>{driver.license_number}</td>
                      <td style={{ padding: '15px' }}>
                        {new Date(driver.license_expiry).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          color: getSafetyColor(driver.safety_score),
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {driver.safety_score}/100
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

export default DashboardSafetyOfficer;
