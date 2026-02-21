import React, { useState, useEffect } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import api from "../services/api";
import "../styles/registry.css";

function VehicleRegistry() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  
  const [formData, setFormData] = useState({
    license_plate: "",
    max_capacity_kg: "",
    odometer_km: ""
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.getVehicles({ page: 1, limit: 100 });
      if (response.success) {
        setVehicles(response.data.vehicles || []);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
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
    try {
      const response = await api.createVehicle({
        license_plate: formData.license_plate,
        max_capacity_kg: parseInt(formData.max_capacity_kg),
        odometer_km: parseInt(formData.odometer_km)
      });
      
      if (response.success) {
        await fetchVehicles(); // Refresh the list
        setFormData({
          license_plate: "",
          max_capacity_kg: "",
          odometer_km: ""
        });
        setShowForm(false);
      }
    } catch (error) {
      alert('Failed to create vehicle: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      license_plate: "",
      max_capacity_kg: "",
      odometer_km: ""
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }
    
    try {
      await api.deleteVehicle(id);
      await fetchVehicles(); // Refresh the list
    } catch (error) {
      alert('Failed to delete vehicle: ' + error.message);
    }
  };

  // Filter vehicles based on search term
  const searchedVehicles = vehicles.filter(vehicle => 
    vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by status
  const filteredVehicles = filterBy 
    ? searchedVehicles.filter(vehicle => vehicle.status === filterBy)
    : searchedVehicles;

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          
          <h1 style={{ marginBottom: '20px', color: '#333' }}>Vehicle Registry</h1>

          {/* Search and Filter Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '15px'
          }}>
            <input 
              type="text"
              placeholder="Search vehicles..."
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
            
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
            </select>

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
              + New Vehicle
            </button>
          </div>

          {/* New Vehicle Form */}
          {showForm && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              marginBottom: '30px'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>New Vehicle Registration</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>License Plate:</label>
                <input 
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC-1234"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Max Capacity (kg):</label>
                <input 
                  type="number"
                  name="max_capacity_kg"
                  value={formData.max_capacity_kg}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Odometer (km):</label>
                <input 
                  type="number"
                  name="odometer_km"
                  value={formData.odometer_km}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
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

          {/* Vehicle Table */}
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
                  }}>License Plate</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Capacity (kg)</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Odometer (km)</th>
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
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      Loading vehicles...
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No vehicles found
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.license_plate}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.max_capacity_kg}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.odometer_km}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          color: vehicle.status === 'Available' ? '#28a745' : 
                                 vehicle.status === 'On Trip' ? '#ffc107' : '#dc3545',
                          fontWeight: '600'
                        }}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <button 
                          onClick={() => handleDelete(vehicle.id)}
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
                          Delete
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

export default VehicleRegistry;
