import React from "react";
import "./Footer.css"; // Import the CSS file

function Footer() {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row">
          {/* Information Section */}
          <div className="col-sm-3">
            <h6 className="footer-heading">Information</h6>
            <ul className="footer-links">
              <li><a href="#">Pages</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-sm-3">
            <h6 className="footer-heading">Resources</h6>
            <ul className="footer-links">
              <li><a href="#">Wikipedia</a></li>
              <li><a href="#">React Blog</a></li>
              <li><a href="#">Terms & Services</a></li>
              <li><a href="#">Angular Dev</a></li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="col-sm-2">
            <h6 className="footer-heading">Help</h6>
            <ul className="footer-links">
              <li><a href="#">Sign Up</a></li>
              <li><a href="#">Login</a></li>
              <li><a href="#">Terms of Services</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-sm-4">
            <h6 className="footer-heading">Contact Us</h6>
            <p className="contact-info">Need help? Reach out to us</p>
            <p className="contact-info">
              <i className="fas fa-phone-alt"></i> +91 9999999999
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>2024 © VNR, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
