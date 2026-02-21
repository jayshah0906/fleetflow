import React, { useState, useEffect } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import api from "../services/api";
import "../styles/dashboard.css";

function Maintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await api.getMaintenance({ page: 1, limit: 100 });
      if (response.success) {
        setMaintenanceRecords(response.data.maintenance || []);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this maintenance as completed?')) {
      return;
    }

    try {
      const response = await api.completeMaintenance(id, {
        actual_cost: 0 // You can add a form to input actual cost
      });

      if (response.success) {
        alert('Maintenance marked as completed!');
        await fetchMaintenance();
      }
    } catch (error) {
      alert('Failed to complete maintenance: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#28a745';
      case 'Scheduled':
        return '#ffc107';
      case 'In Progress':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Maintenance Management</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>
            View and manage vehicle maintenance records
          </p>

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
                  }}>Service Date</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Cost</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Status</th>
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
                      Loading maintenance records...
                    </td>
                  </tr>
                ) : maintenanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No maintenance records found.
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
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: getStatusColor(record.status),
                          fontWeight: '600'
                        }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        {record.status === 'Scheduled' && (
                          <button
                            onClick={() => handleComplete(record.id)}
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
                            Complete
                          </button>
                        )}
                        {record.status === 'Completed' && (
                          <span style={{ color: '#28a745', fontSize: '12px' }}>✓ Done</span>
                        )}
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

export default Maintenance;
