import React, { useState } from "react";
import SidebarSafetyOfficer from "../components/layout/SidebarSafetyOfficer";
import "../styles/dashboard.css";

function SafetyCompliance() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    issueType: "",
    priority: "",
    description: ""
  });

  // Get existing requests from localStorage
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("maintenanceRequests");
    return saved ? JSON.parse(saved) : [];
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const newRequest = {
      id: Date.now(),
      ...formData,
      requestedBy: "Safety Officer",
      requestDate: new Date().toLocaleDateString(),
      status: "Pending Approval"
    };
    
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem("maintenanceRequests", JSON.stringify(updatedRequests));
    
    setFormData({
      vehicleId: "",
      issueType: "",
      priority: "",
      description: ""
    });
    setShowForm(false);
    alert("Maintenance request submitted successfully!");
  };

  const handleCancel = () => {
    setFormData({
      vehicleId: "",
      issueType: "",
      priority: "",
      description: ""
    });
    setShowForm(false);
  };

  return (
    <div className="app-layout">
      <SidebarSafetyOfficer />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Safety Compliance & Maintenance Requests</h1>

          {/* New Request Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '20px'
          }}>
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + New Maintenance Request
            </button>
          </div>

          {/* Request Form */}
          {showForm && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              marginBottom: '30px'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>New Maintenance Request</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Vehicle ID:</label>
                <input 
                  type="text"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  placeholder="e.g., TRK-2024-001"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Issue Type:</label>
                <select 
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Select Issue Type</option>
                  <option value="Engine">Engine</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Tires">Tires</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Body Damage">Body Damage</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Priority:</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Select Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Description:</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue in detail..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  onClick={handleSubmit}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Submit Request
                </button>
                <button 
                  onClick={handleCancel}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Requests Table */}
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
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No maintenance requests yet. Click "New Maintenance Request" to create one.
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
                      <td style={{ padding: '20px', color: '#212529' }}>{request.requestDate}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: request.status === 'Pending Approval' ? '#ffc107' : 
                                 request.status === 'Approved' ? '#28a745' : 
                                 request.status === 'Rejected' ? '#dc3545' : '#007bff',
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

export default SafetyCompliance;
