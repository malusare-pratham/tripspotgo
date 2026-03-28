import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-main-links">
          {/* Column 1: Popular Cities */}
          <div className="footer-col">
            <h4>POPULAR CITIES</h4>
            <ul>
              <li>Mahabaleshwer</li>
              <li>Panchagani</li>
              <li>Lonavala</li>
              <li>Matheran</li>
            </ul>
          </div>

          {/* Column 2: Popular Dine-in */}
          <div className="footer-col">
            <h4>POPULAR DINE-IN</h4>
            <ul>
              <li>Terrace Grill</li>
              <li>Cafe Azure</li>
              <li>Ecstasy Bar</li>
              <li>Gilly's Restobar</li>
              <li>Hotel Kunal</li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="footer-col">
            <h4>USEFUL LINKS</h4>
            <ul>
              <li><Link to="/about-us" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link></li>
              <li><Link to="/contact-us" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</Link></li>
              <li>Terms & Conditions</li>
              <li><Link to="/admin-login" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Login</Link></li>
              <li><Link to="/partner-login" style={{ color: 'inherit', textDecoration: 'none' }}>Partner Login</Link></li>
            </ul>
          </div>

          {/* Column 4: Social & App */}
          <div className="footer-col">
            <h4>CONNECT WITH US</h4>
            <div className="social-icons">
              <a href="#" className="social-icon-link" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon-link" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="social-icon-link" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#" className="social-icon-link" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Name of the Company: Tripspotgo TECHNOLOGIES PRIVATE LIMITED</p>
          <p>Registered Office: Panchagani-Mahabaleshwer Main roade ,near dhobigali , Panchagani -412805</p>
          <div className="copyright">
            &copy; 2026 Tripspotgos. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
