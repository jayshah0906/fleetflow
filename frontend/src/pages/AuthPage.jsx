import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import api from "../services/api";
import "../styles/auth.css";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "dispatcher"
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    try {
      const response = await api.login({
        username: loginData.email.split('@')[0],
        password: loginData.password
      });
      
      if (response.success && response.data.user) {
        const user = response.data.user;
        
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        
        const roleMap = {
          "Fleet Manager": "/fleet-manager",
          "Dispatcher": "/dispatcher",
          "Safety Officer": "/safety-officer",
          "Financial Analyst": "/finance-analyst"
        };
        
        navigate(roleMap[user.role] || "/dashboard");
      }
    } catch (error) {
      setLoginError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (registerData.password !== registerData.confirmPassword) {
      setLoginError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setLoginError("");
    
    try {
      const roleMap = {
        "fleet-manager": "Fleet Manager",
        "dispatcher": "Dispatcher",
        "safety-officer": "Safety Officer",
        "finance-analyst": "Financial Analyst"
      };
      
      const registrationData = {
        username: registerData.email.split('@')[0],
        email: registerData.email,
        password: registerData.password,
        role: roleMap[registerData.role] || "Dispatcher"
      };
      
      const response = await api.register(registrationData);
      
      if (response.success && response.data) {
        // Auto login after registration
        setLoginData({
          email: registerData.email,
          password: registerData.password
        });
        setActiveTab("login");
        setLoginError("Account created successfully! Please sign in.");
      }
    } catch (error) {
      setLoginError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top Navigation */}
      <nav className="auth-nav">
        <div className="auth-nav-logo">
          <Logo size={120} />
        </div>
        <a href="#" className="auth-nav-support">Support</a>
      </nav>

      <div className="auth-content">
        {/* Left Side - Features */}
        <div className="auth-left">
          <div className="auth-left-content">
            <h1 className="auth-brand-title">NEXTRACK</h1>
            <p className="auth-tagline">
              Streamline your fleet operations with intelligent management
              tools designed for modern transportation companies.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <div className="feature-icon">✓</div>
                <span>Real-time vehicle & driver tracking</span>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">✓</div>
                <span>Intelligent maintenance workflow</span>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">✓</div>
                <span>Comprehensive financial analytics</span>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">✓</div>
                <span>Role-based access control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            {/* Tabs */}
            <div className="auth-tabs-modern">
              <button 
                className={`auth-tab-modern ${activeTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("login");
                  setLoginError("");
                }}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab-modern ${activeTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("register");
                  setLoginError("");
                }}
              >
                Create Account
              </button>
            </div>

            {/* Welcome Message */}
            <div className="auth-welcome">
              <h2>{activeTab === "login" ? "Welcome Back" : "Get Started"}</h2>
              <p>{activeTab === "login" ? "Manage your fleet efficiency with ease." : "Create your account to get started."}</p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className={`auth-message ${loginError.includes('successfully') ? 'success' : 'error'}`}>
                {loginError}
              </div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="auth-form-modern">
                <div className="form-group-modern">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                    />
                    <span>Keep me signed in</span>
                  </label>
                </div>

                <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="auth-form-modern">
                <div className="form-group-modern">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                    required
                  >
                    <option value="dispatcher">Dispatcher</option>
                    <option value="fleet-manager">Fleet Manager</option>
                    <option value="safety-officer">Safety Officer</option>
                    <option value="finance-analyst">Financial Analyst</option>
                  </select>
                </div>

                <div className="form-group-modern">
                  <input
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    minLength={8}
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    minLength={8}
                    required
                  />
                </div>

                <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
