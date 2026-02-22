import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-main-links">
          {/* Column 1: Popular Cities */}
          <div className="footer-col">
            <h4>POPULAR CITIES</h4>
            <ul>
              <li>Mumbai</li>
              <li>Pune</li>
              <li>Bangalore</li>
              <li>Delhi</li>
              <li>Hyderabad</li>
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
              <li>About Us</li>
              <li>News Room</li>
              <li>Terms & Conditions</li>
              <li><Link to="/admin-login" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Login</Link></li>
              <li><Link to="/partner-login" style={{ color: 'inherit', textDecoration: 'none' }}>Partner Login</Link></li>
            </ul>
          </div>

          {/* Column 4: Social & App */}
          <div className="footer-col">
            <h4>CONNECT WITH US</h4>
            <div className="social-icons">
              <Facebook size={20} />
              <Instagram size={20} />
              <Linkedin size={20} />
              <Twitter size={20} />
            </div>
            <div className="app-badges">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Name of the Company: NORTH UNION TECHNOLOGIES PRIVATE LIMITED</p>
          <p>Registered Office: Plot No. 12, Sector - 15, Near Metro Station, Pune, Maharashtra - 411001</p>
          <div className="copyright">
            &copy; 2026 North Union. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
