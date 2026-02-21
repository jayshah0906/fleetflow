import React, { useState, useEffect } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import api from "../services/api";
import "../styles/dashboard.css";

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    license_expiry: "",
    safety_score: 85
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await api.getDrivers({ page: 1, limit: 100 });
      if (response.success) {
        setDrivers(response.data.drivers || []);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.license_number || !formData.license_expiry) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const response = await api.createDriver({
        name: formData.name,
        license_number: formData.license_number,
        license_expiry: formData.license_expiry,
        safety_score: parseInt(formData.safety_score) || 85
      });
      
      if (response.success) {
        await fetchDrivers();
        setFormData({
          name: "",
          license_number: "",
          license_expiry: "",
          safety_score: 85
        });
        setShowForm(false);
        alert("Driver added successfully!");
      }
    } catch (error) {
      alert('Failed to create driver: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      license_number: "",
      license_expiry: "",
      safety_score: 85
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this driver?")) {
      return;
    }
    
    try {
      await api.deleteDriver(id);
      await fetchDrivers();
    } catch (error) {
      alert('Failed to delete driver: ' + error.message);
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <div>
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    License Number *
                  </label>
                  <input 
                    type="text"
                    name="license_number"
                    value={formData.license_number}
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    License Expiry Date *
                  </label>
                  <input 
                    type="date"
                    name="license_expiry"
                    value={formData.license_expiry}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Safety Score (0-100)
                  </label>
                  <input 
                    type="number"
                    name="safety_score"
                    value={formData.safety_score}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
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
                  }}>Safety Score</th>
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
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      Loading drivers...
                    </td>
                  </tr>
                ) : filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No drivers found. Click "New Driver" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.name}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.license_number}</td>
                      <td style={{ padding: '20px' }}>
                        <div>
                          <div style={{ color: '#212529' }}>
                            {new Date(driver.license_expiry).toLocaleDateString()}
                          </div>
                          {isExpired(driver.license_expiry) && (
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
                          {!isExpired(driver.license_expiry) && isExpiringSoon(driver.license_expiry) && (
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
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.safety_score}/100</td>
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
