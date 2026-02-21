import React from "react";
import Logo from "../common/Logo";
import "../../styles/auth.css";

function AuthNavbar() {
  return (
    <header className="auth-navbar">
      <div className="brand">
        <Logo size={60} />
      </div>

      <nav>
        <a href="#">Support</a>
      </nav>
    </header>
  );
}

export default AuthNavbar;
