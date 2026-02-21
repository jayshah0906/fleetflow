import React, { useState, useEffect } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import api from "../services/api";
import "../styles/dashboard.css";

function MaintenanceApproval() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await api.getMaintenance({ page: 1, limit: 100 });
      if (response.success) {
        // Filter only scheduled maintenance (pending approval)
        const scheduled = (response.data.maintenance || []).filter(
          m => m.status === 'Scheduled'
        );
        setMaintenanceRecords(scheduled);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this maintenance request?')) {
      return;
    }

    try {
      // In a real app, you'd have an approve endpoint
      // For now, we'll mark it as in progress
      alert('Maintenance approved! (In production, this would update the status)');
      await fetchMaintenance();
    } catch (error) {
      alert('Failed to approve maintenance: ' + error.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this maintenance request?')) {
      return;
    }

    try {
      alert('Maintenance rejected! (In production, this would update the status)');
      await fetchMaintenance();
    } catch (error) {
      alert('Failed to reject maintenance: ' + error.message);
    }
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Maintenance Approval</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>
            Review and approve pending maintenance requests
          </p>

          {maintenanceRecords.length === 0 && !loading && (
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              padding: '20px',
              borderRadius: '8px',
              color: '#155724',
              marginBottom: '20px'
            }}>
              ✓ No pending maintenance requests. All caught up!
            </div>
          )}

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>ID</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Vehicle</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Service Type</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Scheduled Date</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Estimated Cost</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Description</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      Loading maintenance requests...
                    </td>
                  </tr>
                ) : maintenanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No pending maintenance requests
                    </td>
                  </tr>
                ) : (
                  maintenanceRecords.map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{record.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>
                        {record.vehicle_license_plate || `Vehicle #${record.vehicle_id}`}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>{record.service_type}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>
                        {new Date(record.service_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>
                        Rs. {parseFloat(record.cost).toFixed(2)}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>
                        {record.description || 'N/A'}
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleApprove(record.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(record.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Reject
                          </button>
                        </div>
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

export default MaintenanceApproval;
