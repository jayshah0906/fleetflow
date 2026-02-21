import React, { useState, useEffect } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import "../styles/dashboard.css";

function Maintenance() {
  const [requests, setRequests] = useState([]);

  // Load approved requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      const saved = localStorage.getItem("maintenanceRequests");
      const allRequests = saved ? JSON.parse(saved) : [];
      // Only show approved requests
      setRequests(allRequests.filter(req => req.status === "Approved"));
    };
    loadRequests();
    
    // Refresh every second to catch newly approved requests
    const interval = setInterval(loadRequests, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = (id) => {
    const saved = localStorage.getItem("maintenanceRequests");
    const allRequests = saved ? JSON.parse(saved) : [];
    const updatedRequests = allRequests.map(req => 
      req.id === id ? { ...req, status: "Completed", completedDate: new Date().toLocaleDateString() } : req
    );
    localStorage.setItem("maintenanceRequests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests.filter(req => req.status === "Approved"));
    alert("Maintenance marked as completed!");
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Maintenance Management</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>
            Approved maintenance requests ready for execution
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
                  }}>Request ID</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Vehicle ID</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Issue Type</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Priority</th>
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
                  }}>Approved Date</th>
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
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No approved maintenance requests. Waiting for Fleet Manager approval.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{request.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{request.vehicleId}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{request.issueType}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: request.priority === 'Critical' ? '#dc3545' : 
                                 request.priority === 'High' ? '#fd7e14' : 
                                 request.priority === 'Medium' ? '#ffc107' : '#28a745',
                          fontWeight: '600'
                        }}>
                          {request.priority}
                        </span>
                      </td>
                      <td style={{ padding: '20px', color: '#212529', maxWidth: '200px' }}>
                        {request.description}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>{request.approvedDate}</td>
                      <td style={{ padding: '20px' }}>
                        <button 
                          onClick={() => handleComplete(request.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Mark Complete
                        </button>
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
