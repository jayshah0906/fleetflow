import React from "react";
import { Link } from "react-router-dom";
import TruckIcon from "../common/TruckIcon";
import "../../styles/sidebar.css";

function Sidebar() {
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
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/registry">Vehicle Registry</Link>
        <Link to="/operations">Operations</Link>
        <Link to="/admin">Admin Panel</Link>
      </nav>

      <div className="sidebar-user">
        <div className="avatar">AR</div>
        <div>
          <p>Alex Reynolds</p>
          <span>Senior Admin</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
