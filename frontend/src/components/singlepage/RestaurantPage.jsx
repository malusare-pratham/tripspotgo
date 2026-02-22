import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantPage.css';

const RestaurantPage = () => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const tabs = ['OVERVIEW', 'DELIVERY', 'MENU', 'REVIEWS', 'PHOTOS'];

  const sliderImages = [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <div className="rp-main-wrapper">
      {/* Top Navigation Bar */}
      <header className="rp-header">
        <div className="rp-header-content">
          <div className="rp-nav-left">
            <button className="rp-back-btn" onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="rp-logo">MagicPoints</div>
          </div>
          
          <div className="rp-search-bar">
            <input type="text" placeholder="Search for places..." />
          </div>
          
          <div className="rp-nav-right">
            <button className="rp-redeem-btn" onClick={() => navigate('/upload-bill')}>Redeem Now</button>
          </div>
        </div>
      </header>

      {/* Hero Slider Section */}
      <section className="rp-hero-slider">
        <div className="rp-slider-wrapper">
          <div className="rp-slider-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {sliderImages.map((img, index) => (
              <div className="rp-slide" key={index}>
                <img src={img} alt="Special Offer" />
                <div className="rp-slide-overlay"></div>
              </div>
            ))}
          </div>
          <div className="rp-slider-dots">
            {sliderImages.map((_, index) => (
              <span key={index} className={`rp-dot ${currentSlide === index ? 'rp-active' : ''}`} onClick={() => setCurrentSlide(index)}></span>
            ))}
          </div>
        </div>
      </section>

      <main className="rp-content-container">
        {/* Restaurant Profile Card */}
        <section className="rp-restaurant-header">
          <div className="rp-info-flex">
            <div className="rp-logo-wrapper">
              <img src="https://upload.wikimedia.org/wikipedia/sco/d/d2/Pizza_Hut_logo.svg" alt="Pizza Hut" />
            </div>
            <div className="rp-details">
              <h1>Pizza Hut</h1>
              <p className="rp-meta">Quick Bites • Connaught Place, New Delhi</p>
              <p className="rp-cost">Cost for two: <strong>₹350</strong></p>
            </div>
            <div className="rp-rating-badge">
              <div className="rp-stars">★ 4.2</div>
              <p>2.3k+ visits</p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="rp-tabs-nav">
          {tabs.map((tab) => (
            <button key={tab} className={`rp-tab-item ${activeTab === tab ? 'rp-active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        {/* Content Layout */}
        <div className="rp-content-grid">
          <div className="rp-left-panel">
            {activeTab === 'OVERVIEW' ? (
              <section className="rp-vouchers-section">
                <h3>Available Vouchers</h3>
                <div className="rp-vouchers-grid">
                  <div className="rp-voucher-card">
                    <div className="rp-v-info">
                      <p className="rp-v-title">Voucher ₹2000</p>
                      <span className="rp-price">₹1,840</span>
                    </div>
                    <button className="rp-buy-btn">BUY</button>
                  </div>
                  <div className="rp-voucher-card rp-sold-out">
                    <div className="rp-v-info">
                      <p className="rp-v-title">Voucher ₹500</p>
                      <span className="rp-status">SOLD OUT</span>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
               <div className="rp-placeholder">Content for {activeTab} coming soon...</div>
            )}
          </div>

          <div className="rp-right-panel">
            <div className="rp-contact-card">
              <h4>Location</h4>
              <p>Plot no 27, Janpath, New Delhi</p>
              <button className="rp-directions-btn">Get Directions</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantPage;