import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BillPage.css';

const BillPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  const handleGenerateOTP = (e) => {
    e.preventDefault();
    // फॉर्म सबमिट झाल्यावर OTP पेजवर नेण्यासाठी
    navigate('/verify-otp');
  };

  return (
    <div className="bill-page-container bill-scope">
      {/* --- Top Navigation: Logo Left & Back Button Right --- */}
      <div className="bill-top-nav">
        <div className="brand-logo">
          <span className="logo-magic">Magic</span>
          <span className="logo-point">Point</span>
        </div>

        <button className="bill-back-btn" onClick={handleBack}>
          <span>Back</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      {/* --- Main Bill Card --- */}
      <div className="bill-card">
        <div className="bill-header">
          <div className="upload-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h1 className="main-bill-heading">Upload Your Bill</h1>
          <p className="sub-bill-text">Get 10% discount verified instantly</p>
        </div>

        <div className="instructions-box">
          <div className="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Important Instructions</span>
          </div>
          <ul>
            <li>Upload a clear photo of your original bill</li>
            <li>Ensure bill amount and partner name are visible</li>
            <li>Bill must be from today's date</li>
            <li>You'll receive an OTP for verification</li>
          </ul>
        </div>

        <form className="bill-form" onSubmit={handleGenerateOTP}>
          <div className="input-group">
            <label>Select Partner</label>
            <select className="bill-input" required>
              <option value="">Choose a partner...</option>
              <option value="hotel1">Luxury Stay Hotel</option>
              <option value="rest1">The Grand Restaurant</option>
            </select>
          </div>

          <div className="input-group">
            <label>Bill Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input type="number" placeholder="Enter total bill amount" className="bill-input p-left" required />
            </div>
          </div>

          <div className="upload-area">
            <input type="file" id="file-upload" hidden />
            <label htmlFor="file-upload" className="upload-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <h3>Click to upload bill image</h3>
              <p>JPG, PNG up to 10MB</p>
            </label>
          </div>

          <button type="submit" className="generate-btn">
            Generate OTP
          </button>
        </form>

        <div className="feature-grid">
          <div className="feature-item">
            <span className="f-title text-green">10%</span>
            <span className="f-sub">Discount</span>
          </div>
          <div className="feature-item">
            <span className="f-title text-blue">Instant</span>
            <span className="f-sub">Verification</span>
          </div>
          <div className="feature-item">
            <span className="f-title text-orange">Secure</span>
            <span className="f-sub">OTP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
