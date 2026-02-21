import React, { useState, useEffect } from "react";
import SidebarSafetyOfficer from "../components/layout/SidebarSafetyOfficer";
import api from "../services/api";
import "../styles/dashboard.css";

function SafetyCompliance() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complianceStats, setComplianceStats] = useState({
    compliant: 0,
    expiringSoon: 0,
    expired: 0,
    total: 0
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

        // Calculate compliance stats
        const today = new Date();
        let compliant = 0;
        let expiringSoon = 0;
        let expired = 0;

        driversList.forEach(driver => {
          if (!driver.license_expiry) {
            expired++;
            return;
          }

          const expiry = new Date(driver.license_expiry);
          const daysUntil = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

          if (daysUntil < 0) {
            expired++;
          } else if (daysUntil <= 30) {
            expiringSoon++;
          } else {
            compliant++;
          }
        });

        setComplianceStats({
          compliant,
          expiringSoon,
          expired,
          total: driversList.length
        });
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStatus = (driver) => {
    if (!driver.license_expiry) return { status: 'Expired', color: '#dc3545' };

    const today = new Date();
    const expiry = new Date(driver.license_expiry);
    const daysUntil = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return { status: 'Expired', color: '#dc3545' };
    } else if (daysUntil <= 30) {
      return { status: 'Expiring Soon', color: '#ffc107' };
    } else {
      return { status: 'Compliant', color: '#28a745' };
    }
  };

  return (
    <div className="app-layout">
      <SidebarSafetyOfficer />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Safety Compliance</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>
            Monitor driver license compliance and safety standards
          </p>

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
                Total Drivers
              </h3>
              <p style={{ color: '#007bff', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : complianceStats.total}
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
                Compliant
              </h3>
              <p style={{ color: '#28a745', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : complianceStats.compliant}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ffc107', fontSize: '16px', marginBottom: '10px' }}>
                Expiring Soon
              </h3>
              <p style={{ color: '#ffc107', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : complianceStats.expiringSoon}
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
                Expired
              </h3>
              <p style={{ color: '#dc3545', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : complianceStats.expired}
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
              Driver Compliance Status
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
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                      Loading compliance data...
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                      No drivers found
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => {
                    const compliance = getComplianceStatus(driver);
                    return (
                      <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '15px' }}>{driver.name}</td>
                        <td style={{ padding: '15px' }}>{driver.license_number}</td>
                        <td style={{ padding: '15px' }}>
                          {driver.license_expiry 
                            ? new Date(driver.license_expiry).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            color: driver.safety_score >= 90 ? '#28a745' : 
                                   driver.safety_score >= 75 ? '#ffc107' : '#dc3545',
                            fontWeight: '600'
                          }}>
                            {driver.safety_score}/100
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: compliance.color + '20',
                            color: compliance.color
                          }}>
                            {compliance.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SafetyCompliance;
