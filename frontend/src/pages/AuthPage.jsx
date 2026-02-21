import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/layout/AuthNavbar";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import SupportCards from "../components/auth/SupportCards";
import "../styles/auth.css";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleLogin = (credentials) => {
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(credentials));
    localStorage.setItem("isAuthenticated", "true");
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleRegister = (userData) => {
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <>
      <AuthNavbar />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Create Account
            </button>
          </div>

          {activeTab === "login" ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <RegisterForm onRegister={handleRegister} />
          )}
        </div>

        <SupportCards />
      </div>
    </>
  );
}

export default AuthPage;
