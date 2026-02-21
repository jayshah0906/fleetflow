import React, { useState } from "react";
import "../../styles/forms.css";

function LoginForm({ onLogin, loginError }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepSignedIn: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
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
    onLogin(formData);
  };

  return (
    <div className="auth-section">
      <h2>Welcome Back</h2>
      <p>Manage your fleet efficiency with ease.</p>

      {loginError && (
        <div style={{
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {loginError}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="email" 
            name="email"
            placeholder="Email address" 
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <label className="checkbox">
          <input 
            type="checkbox" 
            name="keepSignedIn"
            checked={formData.keepSignedIn}
            onChange={handleChange}
          /> Keep me signed in
        </label>

        <button type="submit" className="primary-btn full">Sign In</button>
      </form>
    </div>
  );
}

export default LoginForm;
