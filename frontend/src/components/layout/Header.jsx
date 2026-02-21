import React from "react";
import "../../styles/layout.css";

function Header({ title, subtitle }) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default Header;
