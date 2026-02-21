import React from "react";
import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© 2024 Fleet Flow Solutions Inc. All rights reserved.</p>

        <div className="footer-links">
          <a href="#">Documentation</a>
          <a href="#">API Status</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
