import React from "react";
import { Link, useNavigate } from "react-router-dom";
import TruckIcon from "../common/TruckIcon";
import "../../styles/sidebar.css";

function SidebarFinanceAnalyst() {
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userName = currentUser.fullName || "User";
  const userRole = currentUser.role || "user";
  
  const formatRole = (role) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
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
        <TruckIcon size={36} />
        <div>
          <h1>Fleet Flow</h1>
          <p>Management Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/finance-analyst">Dashboard</Link>
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

export default SidebarFinanceAnalyst;
