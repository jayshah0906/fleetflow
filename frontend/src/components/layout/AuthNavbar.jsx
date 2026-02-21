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
        <a href="#">Support</a>
      </nav>
    </header>
  );
}

export default AuthNavbar;
