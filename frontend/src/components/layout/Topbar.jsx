import React from "react";
import "../../styles/topbar.css";

function Topbar() {
  return (
    <header className="topbar">
      <input
        type="text"
        placeholder="Search vehicles, drivers or reports..."
        className="search-input"
      />

      <div className="topbar-actions">
        <button>🔔</button>
        <button>💬</button>
        <div className="user-pill">
          <div className="avatar small">FF</div>
          <span>Fleet Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
