import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

const VerifyOTP = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/upload-bill');
  };

  // व्हेरिफाय बटणसाठी फंक्शन
  const handleVerify = () => {
    // इथे तुम्ही हवं असल्यास ओटीपी व्हॅलिडेशन लॉजिक टाकू शकता
    navigate('/confirmation');
  };

  return (
    <div className="otp-page-container otp-scope">
      {/* --- Top Navigation: Logo Left & Back Button Right --- */}
      <div className="otp-top-nav">
        <div className="brand-logo">
          <span className="logo-magic">Magic</span>
          <span className="logo-point">Point</span>
        </div>

        <button className="otp-back-btn" onClick={handleBack}>
          <span>Back</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <div className="otp-card">
        {/* Header Section */}
        <div className="otp-header">
          <div className="shield-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h1 className="main-otp-heading">Verify OTP</h1>
          <p className="sub-otp-text">Enter the 6-digit code sent to your phone</p>
        </div>

        {/* Bill Summary Box */}
        <div className="bill-summary-card">
          <div className="summary-row">
            <span className="label">Partner</span>
            <span className="value">The Grand Hotel Panchgani</span>
          </div>
          <div className="summary-row">
            <span className="label">Bill Amount</span>
            <span className="value">₹50000.00</span>
          </div>
          <div className="summary-row discount-row">
            <span className="label text-green">Your Discount (10%)</span>
            <span className="value text-green">- ₹5000.00</span>
          </div>
        </div>

        {/* OTP Input Section */}
        <div className="otp-input-section">
          <p className="enter-otp-label">Enter OTP</p>
          <div className="otp-box-wrapper">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <input key={index} type="text" maxLength="1" className="otp-box" />
            ))}
          </div>
          {/* onClick function जोडले आहे */}
          <button className="verify-btn" onClick={handleVerify}>
            Verify & Redeem Discount
          </button>
          <div className="resend-wrapper">
            <span>Didn't receive the code?</span>
            <button className="resend-link">Resend OTP</button>
          </div>
        </div>

        {/* Secure Note */}
        <div className="secure-note">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <p>We use OTP verification to ensure your discount is applied securely.</p>
        </div>

        {/* Final Saving Banner */}
        <div className="savings-banner">
          <div className="check-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="saving-text">You're about to save</p>
          <h2 className="saved-amount">₹5000.00</h2>
          <p className="final-total">Final amount: ₹45000.00</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
