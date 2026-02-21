import React, { useState, useEffect } from "react";
import SidebarSafetyOfficer from "../components/layout/SidebarSafetyOfficer";
import "../styles/dashboard.css";

function DashboardSafetyOfficer() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [validDrivers, setValidDrivers] = useState([]);
  const [expiredDrivers, setExpiredDrivers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load vehicles
    const savedVehicles = localStorage.getItem("vehicles");
    if (savedVehicles) {
      const vehicleList = JSON.parse(savedVehicles);
      // Add random maintenance health percentage for demo if not exists
      const vehiclesWithHealth = vehicleList.map(v => ({
        ...v,
        maintenanceHealth: v.maintenanceHealth || Math.floor(Math.random() * 100)
      }));
      setVehicles(vehiclesWithHealth);
    } else {
      setVehicles([]);
    }

    // Load drivers
    const savedDrivers = localStorage.getItem("drivers");
    if (savedDrivers) {
      const driverList = JSON.parse(savedDrivers);
      const today = new Date();
      
      const valid = driverList.filter(d => {
        const expiry = new Date(d.licenseExpiry);
        return expiry >= today;
      });
      
      const expired = driverList.filter(d => {
        const expiry = new Date(d.licenseExpiry);
        return expiry < today;
      });
      
      setDrivers(driverList);
      setValidDrivers(valid);
      setExpiredDrivers(expired);
    } else {
      setDrivers([]);
      setValidDrivers([]);
      setExpiredDrivers([]);
    }
  };

  const handleRemoveDriver = (driverId) => {
    if (window.confirm("Are you sure you want to remove this driver with expired license?")) {
      const updatedDrivers = drivers.filter(d => d.id !== driverId);
      setDrivers(updatedDrivers);
      localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
      loadData();
      alert("Driver removed successfully!");
    }
  };

  const handleSendMaintenanceRequest = (vehicle) => {
    // Get existing maintenance requests
    const existingRequests = JSON.parse(localStorage.getItem("maintenanceRequests") || "[]");
    
    // Check if request already exists for this vehicle
    const requestExists = existingRequests.some(req => 
      req.vehicleId === vehicle.plate && req.status === "Pending Approval"
    );
    
    if (requestExists) {
      alert("A maintenance request for this vehicle is already pending approval.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      vehicleId: vehicle.plate,
      issueType: "Preventive Maintenance",
      priority: vehicle.maintenanceHealth < 30 ? "Critical" : "High",
      description: `Vehicle maintenance health is at ${vehicle.maintenanceHealth}%. Requires immediate attention.`,
      requestedBy: "Safety Officer",
      requestDate: new Date().toLocaleDateString(),
      status: "Pending Approval"
    };
    
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem("maintenanceRequests", JSON.stringify(updatedRequests));
    
    alert("Maintenance request sent to Fleet Manager for approval!");
  };

  const getHealthColor = (health) => {
    if (health >= 70) return '#28a745';
    if (health >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getHealthStatus = (health) => {
    if (health >= 70) return 'Good';
    if (health >= 50) return 'Fair';
    return 'Critical';
  };

  return (
    <div className="app-layout">
      <SidebarSafetyOfficer />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Safety Officer Dashboard</h1>
          
          {/* Summary Cards */}
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
              <h3 style={{ color: '#007bff', fontSize: '16px', marginBottom: '10px' }}>Total Vehicles</h3>
              <p style={{ color: '#007bff', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                {vehicles.length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc3545', fontSize: '16px', marginBottom: '10px' }}>Critical Vehicles</h3>
              <p style={{ color: '#dc3545', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                {vehicles.filter(v => v.maintenanceHealth < 50).length}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '10px' }}>Valid Licenses</h3>
              <p style={{ color: '#28a745', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                {validDrivers.length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc3545', fontSize: '16px', marginBottom: '10px' }}>Expired Licenses</h3>
              <p style={{ color: '#dc3545', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                {expiredDrivers.length}
              </p>
            </div>
          </div>

          {/* Vehicle Maintenance Health Section */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '24px', marginTop: '40px' }}>
            Vehicle Maintenance Health
          </h2>
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
                  }}>Vehicle ID</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Type</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Maintenance Health</th>
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
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No vehicles registered yet. Please add vehicles in Vehicle Registry.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.no} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.plate}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.type}</td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '100%',
                            maxWidth: '200px',
                            height: '20px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${vehicle.maintenanceHealth}%`,
                              height: '100%',
                              backgroundColor: getHealthColor(vehicle.maintenanceHealth),
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{
                            color: getHealthColor(vehicle.maintenanceHealth),
                            fontWeight: '600',
                            minWidth: '50px'
                          }}>
                            {vehicle.maintenanceHealth}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: getHealthColor(vehicle.maintenanceHealth),
                          fontWeight: '600'
                        }}>
                          {getHealthStatus(vehicle.maintenanceHealth)}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        {vehicle.maintenanceHealth < 50 && (
                          <button 
                            onClick={() => handleSendMaintenanceRequest(vehicle)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            Send Maintenance Request
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Driver License Status Section */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '24px', marginTop: '40px' }}>
            Driver License Status
          </h2>

          {/* Valid Licenses */}
          <h3 style={{ color: '#28a745', marginBottom: '15px', fontSize: '18px' }}>
            Valid Licenses ({validDrivers.length})
          </h3>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden',
            marginBottom: '30px'
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
                  }}>Driver Name</th>
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
                  }}>Expiry Date</th>
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
                </tr>
              </thead>
              <tbody>
                {validDrivers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      {drivers.length === 0 
                        ? "No drivers registered yet. Please add drivers in Driver Management."
                        : "No drivers with valid licenses found."}
                    </td>
                  </tr>
                ) : (
                  validDrivers.map((driver) => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.name}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.licenseNumber}</td>
                      <td style={{ padding: '20px', color: '#28a745', fontWeight: '600' }}>
                        {driver.licenseExpiry}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.rating}/100</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{ color: '#28a745', fontWeight: '600' }}>Valid</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Expired Licenses */}
          <h3 style={{ color: '#dc3545', marginBottom: '15px', fontSize: '18px' }}>
            Expired Licenses ({expiredDrivers.length})
          </h3>
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
                  }}>Driver Name</th>
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
                  }}>Expiry Date</th>
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
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      {drivers.length === 0 
                        ? "No drivers registered yet. Please add drivers in Driver Management."
                        : "No drivers with expired licenses. All licenses are valid!"}
                    </td>
                  </tr>
                ) : (
                  expiredDrivers.map((driver) => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: '#fff5f5' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.name}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.licenseNumber}</td>
                      <td style={{ padding: '20px', color: '#dc3545', fontWeight: '600' }}>
                        {driver.licenseExpiry}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.rating}/100</td>
                      <td style={{ padding: '20px' }}>
                        <button 
                          onClick={() => handleRemoveDriver(driver.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Remove Driver
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

export default DashboardSafetyOfficer;
