import React, { useState, useEffect } from "react";
import SidebarDispatcher from "../components/layout/SidebarDispatcher";
import "../styles/dashboard.css";

// City distances matrix (in km)
const cityDistances = {
  "Mumbai": { "Delhi": 1400, "Bangalore": 980, "Kolkata": 2000, "Chennai": 1340, "Hyderabad": 710, "Pune": 150, "Ahmedabad": 530, "Jaipur": 1160, "Lucknow": 1420, "Kanpur": 1450, "Nagpur": 780, "Indore": 590, "Bhopal": 740, "Visakhapatnam": 1030, "Patna": 1850, "Vadodara": 430, "Surat": 280, "Rajkot": 620, "Coimbatore": 1240, "Kochi": 1380 },
  "Delhi": { "Mumbai": 1400, "Bangalore": 2150, "Kolkata": 1470, "Chennai": 2180, "Hyderabad": 1580, "Pune": 1460, "Ahmedabad": 950, "Jaipur": 280, "Lucknow": 550, "Kanpur": 440, "Nagpur": 1120, "Indore": 830, "Bhopal": 740, "Visakhapatnam": 1760, "Patna": 1000, "Vadodara": 940, "Surat": 1150, "Rajkot": 1050, "Coimbatore": 2420, "Kochi": 2680 },
  "Bangalore": { "Mumbai": 980, "Delhi": 2150, "Kolkata": 1880, "Chennai": 350, "Hyderabad": 570, "Pune": 840, "Ahmedabad": 1490, "Jaipur": 2050, "Lucknow": 2100, "Kanpur": 2050, "Nagpur": 900, "Indore": 1280, "Bhopal": 1380, "Visakhapatnam": 800, "Patna": 2050, "Vadodara": 1380, "Surat": 1270, "Rajkot": 1580, "Coimbatore": 360, "Kochi": 560 },
  "Kolkata": { "Mumbai": 2000, "Delhi": 1470, "Bangalore": 1880, "Chennai": 1670, "Hyderabad": 1500, "Pune": 1950, "Ahmedabad": 2050, "Jaipur": 1650, "Lucknow": 980, "Kanpur": 930, "Nagpur": 1090, "Indore": 1550, "Bhopal": 1350, "Visakhapatnam": 680, "Patna": 580, "Vadodara": 1950, "Surat": 2100, "Rajkot": 2200, "Coimbatore": 2050, "Kochi": 2350 },
  "Chennai": { "Mumbai": 1340, "Delhi": 2180, "Bangalore": 350, "Kolkata": 1670, "Hyderabad": 630, "Pune": 1120, "Ahmedabad": 1760, "Jaipur": 2080, "Lucknow": 2050, "Kanpur": 2000, "Nagpur": 1120, "Indore": 1550, "Bhopal": 1600, "Visakhapatnam": 800, "Patna": 1900, "Vadodara": 1650, "Surat": 1540, "Rajkot": 1850, "Coimbatore": 500, "Kochi": 690 },
  "Hyderabad": { "Mumbai": 710, "Delhi": 1580, "Bangalore": 570, "Kolkata": 1500, "Chennai": 630, "Pune": 560, "Ahmedabad": 1180, "Jaipur": 1480, "Lucknow": 1550, "Kanpur": 1500, "Nagpur": 500, "Indore": 850, "Bhopal": 770, "Visakhapatnam": 620, "Patna": 1650, "Vadodara": 1070, "Surat": 960, "Rajkot": 1270, "Coimbatore": 850, "Kochi": 1100 },
  "Pune": { "Mumbai": 150, "Delhi": 1460, "Bangalore": 840, "Kolkata": 1950, "Chennai": 1120, "Hyderabad": 560, "Ahmedabad": 660, "Jaipur": 1220, "Lucknow": 1480, "Kanpur": 1510, "Nagpur": 680, "Indore": 590, "Bhopal": 690, "Visakhapatnam": 930, "Patna": 1800, "Vadodara": 560, "Surat": 410, "Rajkot": 750, "Coimbatore": 1100, "Kochi": 1240 },
  "Ahmedabad": { "Mumbai": 530, "Delhi": 950, "Bangalore": 1490, "Kolkata": 2050, "Chennai": 1760, "Hyderabad": 1180, "Pune": 660, "Jaipur": 660, "Lucknow": 1200, "Kanpur": 1230, "Nagpur": 1050, "Indore": 450, "Bhopal": 530, "Visakhapatnam": 1550, "Patna": 1850, "Vadodara": 110, "Surat": 260, "Rajkot": 220, "Coimbatore": 1950, "Kochi": 2210 },
  "Jaipur": { "Mumbai": 1160, "Delhi": 280, "Bangalore": 2050, "Kolkata": 1650, "Chennai": 2080, "Hyderabad": 1480, "Pune": 1220, "Ahmedabad": 660, "Lucknow": 650, "Kanpur": 580, "Nagpur": 1020, "Indore": 590, "Bhopal": 590, "Visakhapatnam": 1660, "Patna": 1100, "Vadodara": 650, "Surat": 860, "Rajkot": 760, "Coimbatore": 2320, "Kochi": 2580 },
  "Lucknow": { "Mumbai": 1420, "Delhi": 550, "Bangalore": 2100, "Kolkata": 980, "Chennai": 2050, "Hyderabad": 1550, "Pune": 1480, "Ahmedabad": 1200, "Jaipur": 650, "Kanpur": 80, "Nagpur": 1050, "Indore": 950, "Bhopal": 780, "Visakhapatnam": 1450, "Patna": 530, "Vadodara": 1190, "Surat": 1400, "Rajkot": 1300, "Coimbatore": 2370, "Kochi": 2630 },
  "Kanpur": { "Mumbai": 1450, "Delhi": 440, "Bangalore": 2050, "Kolkata": 930, "Chennai": 2000, "Hyderabad": 1500, "Pune": 1510, "Ahmedabad": 1230, "Jaipur": 580, "Lucknow": 80, "Nagpur": 1000, "Indore": 900, "Bhopal": 730, "Visakhapatnam": 1400, "Patna": 480, "Vadodara": 1220, "Surat": 1430, "Rajkot": 1330, "Coimbatore": 2320, "Kochi": 2580 },
  "Nagpur": { "Mumbai": 780, "Delhi": 1120, "Bangalore": 900, "Kolkata": 1090, "Chennai": 1120, "Hyderabad": 500, "Pune": 680, "Ahmedabad": 1050, "Jaipur": 1020, "Lucknow": 1050, "Kanpur": 1000, "Indore": 350, "Bhopal": 350, "Visakhapatnam": 730, "Patna": 1250, "Vadodara": 940, "Surat": 830, "Rajkot": 1140, "Coimbatore": 1180, "Kochi": 1440 },
  "Indore": { "Mumbai": 590, "Delhi": 830, "Bangalore": 1280, "Kolkata": 1550, "Chennai": 1550, "Hyderabad": 850, "Pune": 590, "Ahmedabad": 450, "Jaipur": 590, "Lucknow": 950, "Kanpur": 900, "Nagpur": 350, "Bhopal": 190, "Visakhapatnam": 1220, "Patna": 1400, "Vadodara": 340, "Surat": 550, "Rajkot": 650, "Coimbatore": 1740, "Kochi": 2000 },
  "Bhopal": { "Mumbai": 740, "Delhi": 740, "Bangalore": 1380, "Kolkata": 1350, "Chennai": 1600, "Hyderabad": 770, "Pune": 690, "Ahmedabad": 530, "Jaipur": 590, "Lucknow": 780, "Kanpur": 730, "Nagpur": 350, "Indore": 190, "Visakhapatnam": 1140, "Patna": 1200, "Vadodara": 420, "Surat": 630, "Rajkot": 730, "Coimbatore": 1840, "Kochi": 2100 },
  "Visakhapatnam": { "Mumbai": 1030, "Delhi": 1760, "Bangalore": 800, "Kolkata": 680, "Chennai": 800, "Hyderabad": 620, "Pune": 930, "Ahmedabad": 1550, "Jaipur": 1660, "Lucknow": 1450, "Kanpur": 1400, "Nagpur": 730, "Indore": 1220, "Bhopal": 1140, "Patna": 1050, "Vadodara": 1440, "Surat": 1330, "Rajkot": 1640, "Coimbatore": 1060, "Kochi": 1320 },
  "Patna": { "Mumbai": 1850, "Delhi": 1000, "Bangalore": 2050, "Kolkata": 580, "Chennai": 1900, "Hyderabad": 1650, "Pune": 1800, "Ahmedabad": 1850, "Jaipur": 1100, "Lucknow": 530, "Kanpur": 480, "Nagpur": 1250, "Indore": 1400, "Bhopal": 1200, "Visakhapatnam": 1050, "Vadodara": 1740, "Surat": 1950, "Rajkot": 2050, "Coimbatore": 2220, "Kochi": 2480 },
  "Vadodara": { "Mumbai": 430, "Delhi": 940, "Bangalore": 1380, "Kolkata": 1950, "Chennai": 1650, "Hyderabad": 1070, "Pune": 560, "Ahmedabad": 110, "Jaipur": 650, "Lucknow": 1190, "Kanpur": 1220, "Nagpur": 940, "Indore": 340, "Bhopal": 420, "Visakhapatnam": 1440, "Patna": 1740, "Surat": 150, "Rajkot": 330, "Coimbatore": 1840, "Kochi": 2100 },
  "Surat": { "Mumbai": 280, "Delhi": 1150, "Bangalore": 1270, "Kolkata": 2100, "Chennai": 1540, "Hyderabad": 960, "Pune": 410, "Ahmedabad": 260, "Jaipur": 860, "Lucknow": 1400, "Kanpur": 1430, "Nagpur": 830, "Indore": 550, "Bhopal": 630, "Visakhapatnam": 1330, "Patna": 1950, "Vadodara": 150, "Rajkot": 480, "Coimbatore": 1730, "Kochi": 1990 },
  "Rajkot": { "Mumbai": 620, "Delhi": 1050, "Bangalore": 1580, "Kolkata": 2200, "Chennai": 1850, "Hyderabad": 1270, "Pune": 750, "Ahmedabad": 220, "Jaipur": 760, "Lucknow": 1300, "Kanpur": 1330, "Nagpur": 1140, "Indore": 650, "Bhopal": 730, "Visakhapatnam": 1640, "Patna": 2050, "Vadodara": 330, "Surat": 480, "Coimbatore": 2040, "Kochi": 2300 },
  "Coimbatore": { "Mumbai": 1240, "Delhi": 2420, "Bangalore": 360, "Kolkata": 2050, "Chennai": 500, "Hyderabad": 850, "Pune": 1100, "Ahmedabad": 1950, "Jaipur": 2320, "Lucknow": 2370, "Kanpur": 2320, "Nagpur": 1180, "Indore": 1740, "Bhopal": 1840, "Visakhapatnam": 1060, "Patna": 2220, "Vadodara": 1840, "Surat": 1730, "Rajkot": 2040, "Kochi": 200 },
  "Kochi": { "Mumbai": 1380, "Delhi": 2680, "Bangalore": 560, "Kolkata": 2350, "Chennai": 690, "Hyderabad": 1100, "Pune": 1240, "Ahmedabad": 2210, "Jaipur": 2580, "Lucknow": 2630, "Kanpur": 2580, "Nagpur": 1440, "Indore": 2000, "Bhopal": 2100, "Visakhapatnam": 1320, "Patna": 2480, "Vadodara": 2100, "Surat": 1990, "Rajkot": 2300, "Coimbatore": 200 }
};

const cities = Object.keys(cityDistances);

function NewTrip() {
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    origin: "",
    destination: "",
    cargoType: "",
    cargoWeight: "",
    estimatedDistance: "",
    scheduledDate: ""
  });

  const [cargoError, setCargoError] = useState("");

  useEffect(() => {
    // Auto-calculate distance when origin and destination are selected
    if (formData.origin && formData.destination && formData.origin !== formData.destination) {
      const distance = cityDistances[formData.origin]?.[formData.destination] || 0;
      setFormData(prev => ({ ...prev, estimatedDistance: distance.toString() }));
    }
  }, [formData.origin, formData.destination]);

  // Validate cargo weight against vehicle payload
  useEffect(() => {
    if (formData.vehicleId && formData.cargoWeight) {
      const selectedVehicle = availableVehicles.find(v => v.id === parseInt(formData.vehicleId));
      if (selectedVehicle) {
        const cargoWeight = parseFloat(formData.cargoWeight);
        if (cargoWeight > selectedVehicle.payload) {
          setCargoError(`Error: Cargo weight (${cargoWeight} kg) exceeds vehicle payload capacity (${selectedVehicle.payload} kg)`);
        } else {
          setCargoError("");
        }
      }
    } else {
      setCargoError("");
    }
  }, [formData.vehicleId, formData.cargoWeight, availableVehicles]);

  useEffect(() => {
    // Load vehicles from localStorage
    const savedVehicles = localStorage.getItem("vehicles");
    let vehicles = [];
    
    if (savedVehicles) {
      vehicles = JSON.parse(savedVehicles);
    } else {
      // Default vehicles if none saved
      vehicles = [
        { no: 1, plate: "MH 00", model: "2017", type: "Mini", status: "Idle", payload: 5000 },
        { no: 2, plate: "DL 01", model: "2019", type: "Truck", status: "Idle", payload: 10000 },
        { no: 3, plate: "KA 02", model: "2020", type: "Van", status: "Maintenance", payload: 3000 },
        { no: 4, plate: "TN 03", model: "2018", type: "Truck", status: "Idle", payload: 12000 },
        { no: 5, plate: "UP 04", model: "2021", type: "Mini", status: "Idle", payload: 4000 },
      ];
    }

    // Get maintenance requests to filter out vehicles in maintenance
    const maintenanceRequests = JSON.parse(localStorage.getItem("maintenanceRequests") || "[]");
    const vehiclesInMaintenance = maintenanceRequests
      .filter(req => req.status === "Approved")
      .map(req => req.vehicleId);

    // Filter available vehicles (not in maintenance and idle)
    // Map vehicles to ensure they have proper structure
    const available = vehicles
      .filter(v => 
        v.status !== "Maintenance" && 
        !vehiclesInMaintenance.includes(v.plate)
      )
      .map(v => ({
        id: v.no || v.id,
        plate: v.plate,
        model: v.model,
        type: v.type,
        status: v.status,
        payload: v.payload || 0
      }));
    setAvailableVehicles(available);

    // Load drivers from localStorage
    const savedDrivers = localStorage.getItem("drivers");
    let drivers = [];
    
    if (savedDrivers) {
      drivers = JSON.parse(savedDrivers);
    } else {
      // Default drivers if none saved
      drivers = [
        { id: 1, name: "John Doe", status: "Available", rating: 98 },
        { id: 2, name: "Jane Smith", status: "Available", rating: 95 },
        { id: 3, name: "Mike Johnson", status: "On Trip", rating: 92 },
        { id: 4, name: "Sarah Williams", status: "Available", rating: 97 },
        { id: 5, name: "David Brown", status: "Available", rating: 94 },
      ];
    }

    const availableDriversList = drivers.filter(d => d.status === "Available");
    setAvailableDrivers(availableDriversList);

    // Load existing trips
    const savedTrips = localStorage.getItem("trips");
    setTrips(savedTrips ? JSON.parse(savedTrips) : []);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.vehicleId || !formData.driverId || !formData.origin || !formData.destination) {
      alert("Please fill in all required fields!");
      return;
    }

    // Check for cargo weight error
    if (cargoError) {
      alert(cargoError);
      return;
    }

    // Find selected vehicle and driver
    const selectedVehicle = availableVehicles.find(v => v.id === parseInt(formData.vehicleId));
    const selectedDriver = availableDrivers.find(d => d.id === parseInt(formData.driverId));

    // Create new trip
    const newTrip = {
      id: Date.now(),
      vehicleId: selectedVehicle.plate,
      vehicleType: selectedVehicle.type,
      driverName: selectedDriver.name,
      origin: formData.origin,
      destination: formData.destination,
      cargoType: formData.cargoType,
      cargoWeight: formData.cargoWeight,
      estimatedDistance: formData.estimatedDistance,
      scheduledDate: formData.scheduledDate,
      status: "Scheduled",
      createdDate: new Date().toLocaleDateString()
    };

    // Save trip
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));

    // Reset form
    setFormData({
      vehicleId: "",
      driverId: "",
      origin: "",
      destination: "",
      cargoType: "",
      cargoWeight: "",
      estimatedDistance: "",
      scheduledDate: ""
    });

    alert("Trip created successfully!");
  };

  const handleDelete = (id) => {
    const updatedTrips = trips.filter(t => t.id !== id);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  return (
    <div className="app-layout">
      <SidebarDispatcher />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Create New Trip</h1>

          {/* Trip Creation Form */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            marginBottom: '30px'
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                
                {/* Vehicle Selection */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Select Vehicle *
                  </label>
                  <select 
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  >
                    <option value="">Select a vehicle</option>
                    {availableVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.plate} - {vehicle.type} ({vehicle.model}) - Max: {vehicle.payload} kg
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Selection */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Select Driver *
                  </label>
                  <select 
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  >
                    <option value="">Select a driver</option>
                    {availableDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} (Rating: {driver.rating}/100)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Origin */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Origin *
                  </label>
                  <select 
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  >
                    <option value="">Select origin city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Destination */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Destination *
                  </label>
                  <select 
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  >
                    <option value="">Select destination city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Cargo Type */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Cargo Type
                  </label>
                  <input 
                    type="text"
                    name="cargoType"
                    value={formData.cargoType}
                    onChange={handleInputChange}
                    placeholder="e.g., Electronics"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                {/* Cargo Weight */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Cargo Weight (kg)
                  </label>
                  <input 
                    type="number"
                    name="cargoWeight"
                    value={formData.cargoWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: cargoError ? '2px solid #dc3545' : '1px solid #ddd',
                      backgroundColor: cargoError ? '#fff5f5' : '#fff'
                    }}
                  />
                  {cargoError && (
                    <div style={{
                      color: '#dc3545',
                      backgroundColor: '#f8d7da',
                      border: '1px solid #f5c6cb',
                      padding: '10px',
                      borderRadius: '5px',
                      marginTop: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {cargoError}
                    </div>
                  )}
                </div>

                {/* Estimated Distance */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Estimated Distance (km) - Auto-calculated
                  </label>
                  <input 
                    type="number"
                    name="estimatedDistance"
                    value={formData.estimatedDistance}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: '#e9ecef',
                      color: '#495057'
                    }}
                  />
                </div>

                {/* Scheduled Date */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Scheduled Date
                  </label>
                  <input 
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
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

              <div style={{ marginTop: '20px' }}>
                <button 
                  type="submit"
                  disabled={!!cargoError}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: cargoError ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: cargoError ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: cargoError ? 0.6 : 1
                  }}
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>

          {/* Trips List */}
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '20px' }}>Scheduled Trips</h2>
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
                  }}>Trip ID</th>
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
                  }}>Route</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6'
                  }}>Cargo</th>
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
                {trips.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No trips scheduled yet. Create your first trip above.
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '20px', color: '#212529' }}>{trip.id}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{trip.vehicleId}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>{trip.driverName}</td>
                      <td style={{ padding: '20px', color: '#212529' }}>
                        {trip.origin} → {trip.destination}
                      </td>
                      <td style={{ padding: '20px', color: '#212529' }}>
                        {trip.cargoType || 'N/A'} ({trip.cargoWeight || 'N/A'} kg)
                      </td>
                      <td style={{ padding: '20px' }}>
                        <span style={{ color: '#007bff', fontWeight: '600' }}>
                          {trip.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <button 
                          onClick={() => handleDelete(trip.id)}
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
                          Cancel
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

export default NewTrip;
