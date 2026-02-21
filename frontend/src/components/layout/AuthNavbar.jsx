import React from "react";
import TruckIcon from "../common/TruckIcon";
import "../../styles/auth.css";

function AuthNavbar() {
  return (
    <header className="auth-navbar">
      <div className="brand">
        <TruckIcon size={32} />
        <h1>Fleet Flow</h1>
      </div>

      <nav>
        <a href="#">Solutions</a>
        <a href="#">Pricing</a>
        <a href="#">Support</a>
      </nav>

      <button className="primary-btn">Contact Sales</button>
    </header>
  );
}

export default AuthNavbar;
