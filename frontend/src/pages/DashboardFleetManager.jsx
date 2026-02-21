import React, { useState } from "react";
import SidebarFleetManager from "../components/layout/SidebarFleetManager";
import "../styles/dashboard.css";

function DashboardFleetManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Sample trip data
  const allTrips = [
    { id: 1, vehicle: "TRK-2024-001", driver: "John Doe", status: "On Trip" },
    { id: 2, vehicle: "TRK-2024-002", driver: "Jane Smith", status: "Completed" },
    { id: 3, vehicle: "TRK-2024-003", driver: "Mike Johnson", status: "On Trip" },
    { id: 4, vehicle: "TRK-2024-004", driver: "Sarah Williams", status: "Pending" },
    { id: 5, vehicle: "TRK-2024-005", driver: "David Brown", status: "On Trip" },
    { id: 6, vehicle: "TRK-2024-006", driver: "Emily Davis", status: "Completed" },
    { id: 7, vehicle: "TRK-2024-007", driver: "Robert Wilson", status: "Pending" },
    { id: 8, vehicle: "TRK-2024-008", driver: "Lisa Anderson", status: "On Trip" },
  ];

  // Filter trips based on search term
  const searchedTrips = allTrips.filter(trip => 
    trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by status
  const filteredTrips = filterBy 
    ? searchedTrips.filter(trip => trip.status === filterBy)
    : searchedTrips;

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "id-asc") return a.id - b.id;
    if (sortBy === "id-desc") return b.id - a.id;
    if (sortBy === "vehicle") return a.vehicle.localeCompare(b.vehicle);
    if (sortBy === "driver") return a.driver.localeCompare(b.driver);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  // Group trips
  const groupedTrips = groupBy === "status" 
    ? sortedTrips.reduce((acc, trip) => {
        if (!acc[trip.status]) acc[trip.status] = [];
        acc[trip.status].push(trip);
        return acc;
      }, {})
    : { "All Trips": sortedTrips };

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
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    None
                  </div>
                  <div 
                    onClick={() => { setGroupBy("status"); setShowGroupDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer' }}
                  >
                    Status
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
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    All
                  </div>
                  <div 
                    onClick={() => { setFilterBy("On Trip"); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    On Trip
                  </div>
                  <div 
                    onClick={() => { setFilterBy("Completed"); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    Completed
                  </div>
                  <div 
                    onClick={() => { setFilterBy("Pending"); setShowFilterDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer' }}
                  >
                    Pending
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
                    onClick={() => { setSortBy("id-asc"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    Trip ID (Ascending)
                  </div>
                  <div 
                    onClick={() => { setSortBy("id-desc"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    Trip ID (Descending)
                  </div>
                  <div 
                    onClick={() => { setSortBy("vehicle"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    Vehicle
                  </div>
                  <div 
                    onClick={() => { setSortBy("driver"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    Driver
                  </div>
                  <div 
                    onClick={() => { setSortBy("status"); setShowSortDropdown(false); }}
                    style={{ padding: '10px 15px', cursor: 'pointer' }}
                  >
                    Status
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
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
              <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '10px' }}>Active Fleet</h3>
              <p style={{ color: '#28a745', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>220</p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#6f42c1', fontSize: '16px', marginBottom: '10px' }}>Maintenance Alert</h3>
              <p style={{ color: '#6f42c1', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>05</p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '10px' }}>Pending Cargo</h3>
              <p style={{ color: '#28a745', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>20</p>
            </div>
          </div>

          {/* Trips Table with Grouping */}
          {Object.entries(groupedTrips).map(([groupName, trips]) => (
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
                      }}>Trip</th>
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
                      }}>Driver</th>
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
                    {trips.map((trip) => (
                      <tr key={trip.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '20px', color: '#212529' }}>{trip.id}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{trip.vehicle}</td>
                        <td style={{ padding: '20px', color: '#212529' }}>{trip.driver}</td>
                        <td style={{ padding: '20px' }}>
                          <span style={{
                            color: trip.status === 'On Trip' ? '#fd7e14' : 
                                   trip.status === 'Completed' ? '#28a745' : '#ffc107',
                            fontWeight: '600'
                          }}>
                            {trip.status}
                          </span>
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

export default DashboardFleetManager;
