import React, { useState, useEffect } from "react";
import SidebarDispatcher from "../components/layout/SidebarDispatcher";
import "../styles/dashboard.css";

function DashboardDispatcher() {
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [filterDriverRating, setFilterDriverRating] = useState("");
  const [showVehicleFilter, setShowVehicleFilter] = useState(false);
  const [showDriverFilter, setShowDriverFilter] = useState(false);

  useEffect(() => {
    // Load vehicles from localStorage
    const vehicles = [
      { id: 1, plate: "MH 00", model: "2017", type: "Mini", status: "Idle" },
      { id: 2, plate: "DL 01", model: "2019", type: "Truck", status: "Idle" },
      { id: 3, plate: "KA 02", model: "2020", type: "Van", status: "Maintenance" },
      { id: 4, plate: "TN 03", model: "2018", type: "Truck", status: "Idle" },
      { id: 5, plate: "UP 04", model: "2021", type: "Mini", status: "Idle" },
      { id: 6, plate: "MH 05", model: "2020", type: "Car", status: "Idle" },
      { id: 7, plate: "DL 06", model: "2021", type: "Bike", status: "Idle" },
    ];

    // Get maintenance requests to filter out vehicles in maintenance
    const maintenanceRequests = JSON.parse(localStorage.getItem("maintenanceRequests") || "[]");
    const vehiclesInMaintenance = maintenanceRequests
      .filter(req => req.status === "Approved")
      .map(req => req.vehicleId);

    // Filter available vehicles (not in maintenance and idle)
    const available = vehicles.filter(v => 
      v.status !== "Maintenance" && 
      !vehiclesInMaintenance.includes(v.plate)
    );
    setAvailableVehicles(available);

    // Sample drivers data
    const drivers = [
      { id: 1, name: "John Doe", status: "Available", rating: 98 },
      { id: 2, name: "Jane Smith", status: "Available", rating: 95 },
      { id: 3, name: "Mike Johnson", status: "On Trip", rating: 92 },
      { id: 4, name: "Sarah Williams", status: "Available", rating: 97 },
      { id: 5, name: "David Brown", status: "Available", rating: 94 },
      { id: 6, name: "Emily Davis", status: "On Trip", rating: 96 },
      { id: 7, name: "Robert Wilson", status: "Available", rating: 89 },
      { id: 8, name: "Lisa Anderson", status: "Available", rating: 91 },
    ];

    // Filter available drivers
    const availableDriversList = drivers.filter(d => d.status === "Available");
    setAvailableDrivers(availableDriversList);
  }, []);

  // Filter vehicles based on search and filters
  const filteredVehicles = availableVehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterVehicleType ? vehicle.type === filterVehicleType : true;
    return matchesSearch && matchesType;
  });

  // Filter drivers based on search and filters
  const filteredDrivers = availableDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterDriverRating === "high" ? driver.rating >= 95 :
                         filterDriverRating === "medium" ? driver.rating >= 90 && driver.rating < 95 :
                         filterDriverRating === "low" ? driver.rating < 90 : true;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="app-layout">
      <SidebarDispatcher />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Dispatcher Dashboard</h1>
          
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
              placeholder="Search vehicles or drivers..."
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
            
            {/* Vehicle Type Filter */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowVehicleFilter(!showVehicleFilter);
                  setShowDriverFilter(false);
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
                Vehicle Type {filterVehicleType && `(${filterVehicleType})`}
              </button>
              {showVehicleFilter && (
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
                    onClick={() => { setFilterVehicleType(""); setShowVehicleFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    All Types
                  </div>
                  <div 
                    onClick={() => { setFilterVehicleType("Truck"); setShowVehicleFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Truck
                  </div>
                  <div 
                    onClick={() => { setFilterVehicleType("Car"); setShowVehicleFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Car
                  </div>
                  <div 
                    onClick={() => { setFilterVehicleType("Bike"); setShowVehicleFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', color: '#000' }}
                  >
                    Bike
                  </div>
                </div>
              )}
            </div>

            {/* Driver Rating Filter */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowDriverFilter(!showDriverFilter);
                  setShowVehicleFilter(false);
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
                Driver Rating {filterDriverRating && `(${filterDriverRating})`}
              </button>
              {showDriverFilter && (
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
                    onClick={() => { setFilterDriverRating(""); setShowDriverFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    All Ratings
                  </div>
                  <div 
                    onClick={() => { setFilterDriverRating("high"); setShowDriverFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    High (95+)
                  </div>
                  <div 
                    onClick={() => { setFilterDriverRating("medium"); setShowDriverFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000' }}
                  >
                    Medium (90-94)
                  </div>
                  <div 
                    onClick={() => { setFilterDriverRating("low"); setShowDriverFilter(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', color: '#000' }}
                  >
                    Low (&lt;90)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
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
              <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '10px' }}>Available Vehicles</h3>
              <p style={{ color: '#28a745', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                {filteredVehicles.length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', fontSize: '16px', marginBottom: '10px' }}>Available Drivers</h3>
              <p style={{ color: '#007bff', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
                {filteredDrivers.length}
              </p>
            </div>
          </div>

          {/* Available Vehicles Table */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '20px' }}>Available Vehicles</h2>
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
                  }}>ID</th>
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
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No vehicles match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.plate}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.model}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{vehicle.type}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{ color: '#28a745', fontWeight: '600' }}>
                          {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Available Drivers Table */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '20px' }}>Available Drivers</h2>
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
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No drivers match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.name}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{driver.rating}/100</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{ color: '#28a745', fontWeight: '600' }}>
                          {driver.status}
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

export default DashboardDispatcher;
