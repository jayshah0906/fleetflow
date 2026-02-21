import React, { useState } from "react";
import "../../styles/forms.css";

function RegisterForm({ onRegister }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call parent handler
    onRegister(formData);
  };

  return (
    <div className="auth-section">
      <h2>Join Fleet Flow</h2>
      <p>Enterprise-grade logistics management.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="text" 
            name="fullName"
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "error" : ""}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <input 
            type="email" 
            name="email"
            placeholder="Work Email" 
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? "error" : ""}
          >
            <option value="">Select Role</option>
            <option value="fleet-manager">Fleet Manager</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="safety-officer">Safety Officer</option>
            <option value="finance-analyst">Finance Analyst</option>
          </select>
          {errors.role && <span className="error-text">{errors.role}</span>}
        </div>

        <div className="form-group">
          <input 
            type="password" 
            name="password"
            placeholder="Create Password" 
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="secondary-btn full">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
