import React, { useState } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import "../styles/registry.css";

function VehicleRegistry() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    licensePlate: "",
    maxPayload: "",
    initialOdometer: "",
    type: "",
    model: ""
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem("vehicles");
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Initialize with default vehicles
      const defaultVehicles = [
        { no: 1, plate: "MH 00", model: "2017", type: "Mini", capacity: "5 tonn", odometer: "79000", status: "Idle", payload: 5000 },
        { no: 2, plate: "DL 01", model: "2019", type: "Truck", capacity: "10 tonn", odometer: "45000", status: "Active", payload: 10000 },
        { no: 3, plate: "KA 02", model: "2020", type: "Van", capacity: "3 tonn", odometer: "32000", status: "Maintenance", payload: 3000 },
        { no: 4, plate: "TN 03", model: "2018", type: "Truck", capacity: "12 tonn", odometer: "68000", status: "Active", payload: 12000 },
        { no: 5, plate: "UP 04", model: "2021", type: "Mini", capacity: "4 tonn", odometer: "15000", status: "Idle", payload: 4000 },
      ];
      localStorage.setItem("vehicles", JSON.stringify(defaultVehicles));
      return defaultVehicles;
    }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    const newVehicle = {
      no: vehicles.length + 1,
      plate: formData.licensePlate,
      model: new Date().getFullYear().toString(),
      type: formData.type,
      capacity: formData.maxPayload,
      odometer: formData.initialOdometer,
      status: "Idle",
      payload: parseFloat(formData.maxPayload) || 0
    };
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    setFormData({
      licensePlate: "",
      maxPayload: "",
      initialOdometer: "",
      type: "",
      model: ""
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({
      licensePlate: "",
      maxPayload: "",
      initialOdometer: "",
      type: "",
      model: ""
    });
    setShowForm(false);
  };

  const handleDelete = (no) => {
    const updatedVehicles = vehicles.filter(v => v.no !== no);
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
  };

  // Filter vehicles based on search term
  const searchedVehicles = vehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by status
  const filteredVehicles = filterBy 
    ? searchedVehicles.filter(vehicle => vehicle.status === filterBy)
    : searchedVehicles;

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === "no-asc") return a.no - b.no;
    if (sortBy === "no-desc") return b.no - a.no;
    if (sortBy === "plate") return a.plate.localeCompare(b.plate);
    if (sortBy === "type") return a.type.localeCompare(b.type);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  // Group vehicles
  const groupedVehicles = groupBy === "status" 
    ? sortedVehicles.reduce((acc, vehicle) => {
        if (!acc[vehicle.status]) acc[vehicle.status] = [];
        acc[vehicle.status].push(vehicle);
        return acc;
      }, {})
    : groupBy === "type"
    ? sortedVehicles.reduce((acc, vehicle) => {
        if (!acc[vehicle.type]) acc[vehicle.type] = [];
        acc[vehicle.type].push(vehicle);
        return acc;
      }, {})
    : { "All Vehicles": sortedVehicles };

  return (
    <div className="app-layout">
      <SidebarFleetManager />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          
          {/* Search and Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '15px'
          }}>
            <input 
              type="text"
              placeholder="Search bar..."
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
            
            {/* Group By Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowGroupDropdown(!showGroupDropdown);
                  setShowFilterDropdown(false);
                  setShowSortDropdown(false);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Group by {groupBy && `(${groupBy})`}
              </button>
              {showGroupDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '5px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '150px'
                }}>
                  <div 
                    onClick={() => { setGroupBy(""); setShowGroupDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    None
                  </div>
                  <div 
                    onClick={() => { setGroupBy("status"); setShowGroupDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Status
                  </div>
                  <div 
                    onClick={() => { setGroupBy("type"); setShowGroupDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', color: '#000' }}
                  >
                    Type
                  </div>
                </div>
              )}
            </div>

            {/* Filter Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowGroupDropdown(false);
                  setShowSortDropdown(false);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Filter {filterBy && `(${filterBy})`}
              </button>
              {showFilterDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '5px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '150px'
                }}>
                  <div 
                    onClick={() => { setFilterBy(""); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    All
                  </div>
                  <div 
                    onClick={() => { setFilterBy("Active"); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Active
                  </div>
                  <div 
                    onClick={() => { setFilterBy("Idle"); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Idle
                  </div>
                  <div 
                    onClick={() => { setFilterBy("Maintenance"); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', color: '#000' }}
                  >
                    Maintenance
                  </div>
                </div>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowGroupDropdown(false);
                  setShowFilterDropdown(false);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Sort by...
              </button>
              {showSortDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '5px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '180px'
                }}>
                  <div 
                    onClick={() => { setSortBy("no-asc"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    NO (Ascending)
                  </div>
                  <div 
                    onClick={() => { setSortBy("no-desc"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    NO (Descending)
                  </div>
                  <div 
                    onClick={() => { setSortBy("plate"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Plate
                  </div>
                  <div 
                    onClick={() => { setSortBy("type"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Type
                  </div>
                  <div 
                    onClick={() => { setSortBy("status"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', color: '#000' }}
                  >
                    Status
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Vehicle Button */}
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
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Max Payload (kg):</label>
                <input 
                  type="number"
                  name="maxPayload"
                  value={formData.maxPayload}
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Initial Odometer:</label>
                <input 
                  type="text"
                  name="initialOdometer"
                  value={formData.initialOdometer}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Type:</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Truck">Truck</option>
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Model:</label>
                <input 
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
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

          {/* Vehicle Table with Grouping */}
          {Object.entries(groupedVehicles).map(([groupName, vehicleList]) => (
            <div key={groupName} style={{ marginBottom: '30px' }}>
              {groupBy && (
                <h2 style={{ 
                  color: '#333', 
                  marginBottom: '15px',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {groupName}
                </h2>
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
                      }}>NO</th>
                      <th style={{
                        padding: '20px',
                        textAlign: 'left',
                        color: '#495057',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '2px solid #dee2e6'
                      }}>Plate</th>
                      <th style={{
                        padding: '20px',
                        textAlign: 'left',
                        color: '#495057',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '2px solid #dee2e6'
                      }}>Model</th>
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
                      }}>Capacity</th>
                      <th style={{
                        padding: '20px',
                        textAlign: 'left',
                        color: '#495057',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '2px solid #dee2e6'
                      }}>Odometer</th>
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
                    {vehicleList.map((vehicle) => (
                      <tr key={vehicle.no} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '20px', color: '#212529' }}>{vehicle.no}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{vehicle.plate}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{vehicle.model}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{vehicle.type}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{vehicle.capacity}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{vehicle.odometer}</td>
                        <td style={{ padding: '20px' }}>
                          <span style={{
                            color: vehicle.status === 'Active' ? '#28a745' : 
                                   vehicle.status === 'Idle' ? '#ffc107' : '#dc3545',
                            fontWeight: '600'
                          }}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td style={{ padding: '20px' }}>
                          <button 
                            onClick={() => handleDelete(vehicle.no)}
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
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VehicleRegistry;
