import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDispatcher from "../components/layout/SidebarDispatcher";
import api from "../services/api";
import "../styles/dashboard.css";

function NewTrip() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    driver_id: "",
    vehicle_id: "",
    origin: "",
    destination: "",
    cargo_weight_kg: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        api.getVehicles({ page: 1, limit: 100 }),
        api.getDrivers({ page: 1, limit: 100 })
      ]);

      if (vehiclesRes.success) {
        // Filter only available vehicles
        const availableVehicles = vehiclesRes.data.vehicles.filter(v => v.status === 'Available');
        setVehicles(availableVehicles);
      }

      if (driversRes.success) {
        setDrivers(driversRes.data.drivers || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.driver_id) {
      newErrors.driver_id = "Please select a driver";
    }

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = "Please select a vehicle";
    }

    if (!formData.origin.trim()) {
      newErrors.origin = "Origin is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.cargo_weight_kg) {
      newErrors.cargo_weight_kg = "Cargo weight is required";
    } else if (parseFloat(formData.cargo_weight_kg) <= 0) {
      newErrors.cargo_weight_kg = "Cargo weight must be greater than 0";
    }

    // Check if cargo weight exceeds vehicle capacity
    if (formData.vehicle_id && formData.cargo_weight_kg) {
      const selectedVehicle = vehicles.find(v => v.id === parseInt(formData.vehicle_id));
      if (selectedVehicle && parseFloat(formData.cargo_weight_kg) > selectedVehicle.max_capacity_kg) {
        newErrors.cargo_weight_kg = `Cargo weight exceeds vehicle capacity (${selectedVehicle.max_capacity_kg} kg)`;
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.createTrip({
        driver_id: parseInt(formData.driver_id),
        vehicle_id: parseInt(formData.vehicle_id),
        origin: formData.origin,
        destination: formData.destination,
        cargo_weight_kg: parseFloat(formData.cargo_weight_kg)
      });

      if (response.success) {
        alert('Trip created successfully!');
        navigate('/dispatcher');
      }
    } catch (error) {
      alert('Failed to create trip: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dispatcher');
  };

  if (loading) {
    return (
      <div className="app-layout">
        <SidebarDispatcher />
        <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
          <div className="page-content" style={{ padding: '40px', textAlign: 'center' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <SidebarDispatcher />
      <div className="content-area" style={{ backgroundColor: '#ffffff' }}>
        <div className="page-content" style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Create New Trip</h1>

          <form onSubmit={handleSubmit}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              marginBottom: '30px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                
                {/* Driver Selection */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Select Driver *
                  </label>
                  <select
                    name="driver_id"
                    value={formData.driver_id}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: errors.driver_id ? '1px solid #dc3545' : '1px solid #ddd',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">-- Select Driver --</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} (License: {driver.license_number})
                      </option>
                    ))}
                  </select>
                  {errors.driver_id && (
                    <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.driver_id}</span>
                  )}
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Select Vehicle *
                  </label>
                  <select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: errors.vehicle_id ? '1px solid #dc3545' : '1px solid #ddd',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.license_plate} (Capacity: {vehicle.max_capacity_kg} kg)
                      </option>
                    ))}
                  </select>
                  {errors.vehicle_id && (
                    <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.vehicle_id}</span>
                  )}
                </div>

                {/* Origin */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Origin *
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai Warehouse"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: errors.origin ? '1px solid #dc3545' : '1px solid #ddd'
                    }}
                  />
                  {errors.origin && (
                    <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.origin}</span>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="e.g., Delhi Distribution Center"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: errors.destination ? '1px solid #dc3545' : '1px solid #ddd'
                    }}
                  />
                  {errors.destination && (
                    <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.destination}</span>
                  )}
                </div>

                {/* Cargo Weight */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '600' }}>
                    Cargo Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="cargo_weight_kg"
                    value={formData.cargo_weight_kg}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000"
                    min="1"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: errors.cargo_weight_kg ? '1px solid #dc3545' : '1px solid #ddd'
                    }}
                  />
                  {errors.cargo_weight_kg && (
                    <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.cargo_weight_kg}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: submitting ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {submitting ? 'Creating...' : 'Create Trip'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {vehicles.length === 0 && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              padding: '15px',
              borderRadius: '8px',
              color: '#856404',
              marginTop: '20px'
            }}>
              No available vehicles. Please ensure vehicles are marked as "Available" in the Vehicle Registry.
            </div>
          )}

          {drivers.length === 0 && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              padding: '15px',
              borderRadius: '8px',
              color: '#856404',
              marginTop: '20px'
            }}>
              No drivers available. Please add drivers in Driver Management.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewTrip;
