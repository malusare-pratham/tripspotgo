import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAuthenticated = false, onLogout, showMobileMenu = true }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/DashboardPage");
      return;
    }
    navigate("/");
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      if (onLogout) onLogout();
      return;
    }
    navigate("/signup");
  };

  return (
    <nav className="magic-navbar">
      <div className="nav-container">
        <div className="nav-left">
          <h2 className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            magicpoint
          </h2>
          <span className="tagline">Local Savings SuperApp</span>
        </div>

        <div className="nav-right-section">
          <div className={`menu-pill ${isAuthenticated ? "dashboard-pill" : ""}`}>
            {isAuthenticated ? (
              <>
                <ul className="nav-links">
                  <li>About us</li>
                  <li>Contact us</li>
                  <li>Blog</li>
                </ul>

                <button className="signin-btn" onClick={handleAuthAction}>
                  Logout
                </button>

                {showMobileMenu && (
                  <button
                    className="premium-menu-btn"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Open menu options"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </button>
                )}

                {showMobileMenu && menuOpen && (
                  <div className="premium-dropdown">
                    <button type="button">About us</button>
                    <button type="button">Contact us</button>
                    <button type="button">Blog</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <ul className="nav-links">
                  <li>About us</li>
                  <li>Contact us</li>
                  <li>Blog</li>
                </ul>
                <button className="signin-btn" onClick={handleAuthAction}>
                  Sign In/Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
