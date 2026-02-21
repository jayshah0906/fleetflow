import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import "../../styles/sidebar.css";

function SidebarFleetManager() {
  const navigate = useNavigate();
  
  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userName = currentUser.fullName || "User";
  const userRole = currentUser.role || "user";
  
  // Format role for display
  const formatRole = (role) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo size={80} />
      </div>

      <nav className="sidebar-nav">
        <Link to="/fleet-manager">Dashboard</Link>
        <Link to="/registry">Vehicle Registry</Link>
        <Link to="/driver-management">Driver Management</Link>
        <Link to="/maintenance-approval">Maintenance Approval</Link>
        <Link to="/maintenance">Maintenance</Link>
        <Link to="/finance-report-manager">Finance Report</Link>
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{getInitials(userName)}</div>
        <div>
          <p>{userName}</p>
          <span>{formatRole(userRole)}</span>
        </div>
      </div>
      
      <button 
        onClick={handleLogout} 
        style={{
          width: '90%',
          margin: '10px auto',
          padding: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Logout
      </button>
    </aside>
  );
}

export default SidebarFleetManager;
