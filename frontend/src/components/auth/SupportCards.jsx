import React from "react";
import "../../styles/auth.css";

function SupportCards() {
  return (
    <div className="support-grid">
      <div className="support-card">
        <h3>Secure Access</h3>
        <p>256-bit SSL encrypted connection</p>
      </div>

      <div className="support-card">
        <h3>24/7 Fleet Support</h3>
        <p>Immediate assistance for managers</p>
      </div>

      <div className="support-card">
        <h3>Cloud Sync</h3>
        <p>Real-time data across all devices</p>
      </div>
    </div>
  );
}

export default SupportCards;
