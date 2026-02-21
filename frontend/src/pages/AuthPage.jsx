import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/layout/AuthNavbar";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "../styles/auth.css";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (credentials) => {
    // Get all registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    
    // Find user with matching email and password
    const user = registeredUsers.find(
      u => u.email === credentials.email && 
           u.password === credentials.password
    );
    
    if (user) {
      // Store current user and authentication status
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
      
      // Clear any previous errors
      setLoginError("");
      
      // Navigate to role-specific dashboard
      switch(user.role) {
        case "fleet-manager":
          navigate("/fleet-manager");
          break;
        case "dispatcher":
          navigate("/dispatcher");
          break;
        case "safety-officer":
          navigate("/safety-officer");
          break;
        case "finance-analyst":
          navigate("/finance-analyst");
          break;
        default:
          navigate("/dashboard");
      }
    } else {
      // Show error message in red
      setLoginError("Invalid email or password. Please check your credentials.");
    }
  };

  const handleRegister = (userData) => {
    // Get existing registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    
    // Check if email already exists
    const emailExists = registeredUsers.some(u => u.email === userData.email);
    
    if (emailExists) {
      alert("This email is already registered. Please login instead.");
      return;
    }
    
    // Add new user to registered users
    registeredUsers.push(userData);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    
    // Store current user and authentication status
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
    
    // Navigate to role-specific dashboard based on selected role
    switch(userData.role) {
      case "fleet-manager":
        navigate("/fleet-manager");
        break;
      case "dispatcher":
        navigate("/dispatcher");
        break;
      case "safety-officer":
        navigate("/safety-officer");
        break;
      case "finance-analyst":
        navigate("/finance-analyst");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <>
      <AuthNavbar />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
              }}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("register");
                setLoginError("");
              }}
            >
              Create Account
            </button>
          </div>

          {activeTab === "login" ? (
            <LoginForm onLogin={handleLogin} loginError={loginError} />
          ) : (
            <RegisterForm onRegister={handleRegister} />
          )}
        </div>
      </div>
    </>
  );
}

export default AuthPage;
