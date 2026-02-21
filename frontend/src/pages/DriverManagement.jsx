import React, { useState } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import "../styles/dashboard.css";

function DriverManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    licenseNumber: "",
    licenseExpiry: ""
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem("drivers");
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Initialize with default drivers
      const defaultDrivers = [
        { id: 1, name: "John Doe", age: 35, licenseNumber: "DL-1234567890", licenseExpiry: "2026-12-31", status: "Available", rating: 98 },
        { id: 2, name: "Jane Smith", age: 28, licenseNumber: "DL-0987654321", licenseExpiry: "2027-06-15", status: "Available", rating: 95 },
        { id: 3, name: "Mike Johnson", age: 42, licenseNumber: "DL-1122334455", licenseExpiry: "2025-09-20", status: "On Trip", rating: 92 },
        { id: 4, name: "Sarah Williams", age: 31, licenseNumber: "DL-5544332211", licenseExpiry: "2028-03-10", status: "Available", rating: 97 },
        { id: 5, name: "David Brown", age: 38, licenseNumber: "DL-6677889900", licenseExpiry: "2026-08-25", status: "Available", rating: 94 },
      ];
      localStorage.setItem("drivers", JSON.stringify(defaultDrivers));
      return defaultDrivers;
    }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Validate form
    if (!formData.name || !formData.age || !formData.licenseNumber || !formData.licenseExpiry) {
      alert("Please fill in all fields!");
      return;
    }

    const newDriver = {
      id: drivers.length + 1,
      name: formData.name,
      age: parseInt(formData.age),
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry,
      status: "Available",
      rating: 85 // Default rating for new drivers
    };
    
    const updatedDrivers = [...drivers, newDriver];
    setDrivers(updatedDrivers);
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    
    setFormData({
      name: "",
      age: "",
      licenseNumber: "",
      licenseExpiry: ""
    });
    setShowForm(false);
    alert("Driver added successfully!");
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      age: "",
      licenseNumber: "",
      licenseExpiry: ""
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this driver?")) {
      const updatedDrivers = drivers.filter(d => d.id !== id);
      setDrivers(updatedDrivers);
      localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    }
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if license is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Driver Management</h1>

          {/* Search Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '15px'
          }}>
            <input 
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </div>

          {/* New Driver Button */}
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
              + New Driver
            </button>
          </div>

          {/* New Driver Form */}
          {showForm && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              marginBottom: '30px'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>New Driver Registration</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Driver Name *
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Age *
                  </label>
                  <input 
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 35"
                    min="18"
                    max="65"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    License Number *
                  </label>
                  <input 
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., DL-1234567890"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    License Expiry Date *
                  </label>
                  <input 
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button 
                  onClick={handleSave}
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
                  Save
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

          {/* Drivers Table */}
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
                  }}>Name</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Age</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>License Number</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>License Expiry</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Rating</th>
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
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No drivers found. Click "New Driver" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.name}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.age}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.licenseNumber}</td>
                      <td style={{ padding: '20px' }}>
                        <div>
                          <div style={{ color: '#212529' }}>{driver.licenseExpiry}</div>
                          {isExpired(driver.licenseExpiry) && (
                            <span style={{
                              display: 'inline-block',
                              marginTop: '5px',
                              padding: '3px 8px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              EXPIRED
                            </span>
                          )}
                          {!isExpired(driver.licenseExpiry) && isExpiringSoon(driver.licenseExpiry) && (
                            <span style={{
                              display: 'inline-block',
                              marginTop: '5px',
                              padding: '3px 8px',
                              backgroundColor: '#ffc107',
                              color: '#000',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              EXPIRING SOON
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.rating}/100</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: driver.status === 'Available' ? '#28a745' : '#007bff',
                          fontWeight: '600'
                        }}>
                          {driver.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <button 
                          onClick={() => handleDelete(driver.id)}
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
                          Remove
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

export default DriverManagement;
