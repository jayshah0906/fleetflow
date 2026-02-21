import React, { useState, useEffect } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import "../styles/dashboard.css";

function MaintenanceApproval() {
  const [requests, setRequests] = useState([]);

  // Load requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      const saved = localStorage.getItem("maintenanceRequests");
      setRequests(saved ? JSON.parse(saved) : []);
    };
    loadRequests();
    
    // Refresh every second to catch new requests
    const interval = setInterval(loadRequests, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: "Approved", approvedDate: new Date().toLocaleDateString() } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("maintenanceRequests", JSON.stringify(updatedRequests));
    alert("Maintenance request approved!");
  };

  const handleReject = (id) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: "Rejected" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("maintenanceRequests", JSON.stringify(updatedRequests));
    alert("Maintenance request rejected!");
  };

  const pendingRequests = requests.filter(req => req.status === "Pending Approval");
  const processedRequests = requests.filter(req => req.status !== "Pending Approval");

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Maintenance Request Approval</h1>

          {/* Pending Requests */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '20px' }}>Pending Requests</h2>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden',
            marginBottom: '40px'
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
                  }}>Request Date</th>
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
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No pending maintenance requests.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
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
                      <td style={{ padding: '20px', color: '#212529' }}>{request.requestDate}</td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            onClick={() => handleApprove(request.id)}
                            style={{
                              padding: '8px 16px',
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
                            onClick={() => handleReject(request.id)}
                            style={{
                              padding: '8px 16px',
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

          {/* Processed Requests */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '20px' }}>Processed Requests</h2>
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
                  }}>Request Date</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {processedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No processed requests yet.
                    </td>
                  </tr>
                ) : (
                  processedRequests.map((request) => (
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
                      <td style={{ padding: '20px', color: '#212529' }}>{request.requestDate}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: request.status === 'Approved' ? '#28a745' : '#dc3545',
                          fontWeight: '600'
                        }}>
                          {request.status}
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

export default MaintenanceApproval;
