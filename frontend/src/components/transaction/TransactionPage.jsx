import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, Wallet, Zap, 
  Download, CheckCircle, Utensils, Hotel, Store, Bike, Filter
} from 'lucide-react';
import './TransactionPage.css';

const TransactionPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    { name: "All", icon: <Filter size={14} /> },
    { name: "Food & Dining", icon: <Utensils size={14} /> },
    { name: "Activities", icon: <Bike size={14} /> },
    { name: "Stores", icon: <Store size={14} /> },
    { name: "Hotels & Villas", icon: <Hotel size={14} /> }
  ];

  return (
    <div className="tx-premium-root">
      <div className="tx-wrapper">
        
        {/* Top Header */}
        <header className="tx-header-compact">
          <button className="back-circle" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div className="header-text">
            <h1>History</h1>
            <p>Smart Savings Summary</p>
          </div>
        </header>

        {/* 1. Stats Grid - Fits perfectly in one frame */}
        <div className="tx-stats-grid">
          <div className="stat-card-mini s-mint">
            <TrendingUp size={16} className="stat-icon" />
            <h3>₹1000.00</h3>
            <label>Total Savings</label>
          </div>
          <div className="stat-card-mini s-navy">
            <Wallet size={16} className="stat-icon" />
            <h3>04</h3>
            <label>Transactions</label>
          </div>
          <div className="stat-card-mini s-blue">
            <Zap size={16} className="stat-icon" />
            <h3>₹250.00</h3>
            <label>Avg Savings</label>
          </div>
        </div>

        {/* 2. Responsive Filter Pills (Visible on all devices) */}
        <div className="tx-filter-scroll">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              className={`filter-pill ${activeTab === cat.name ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 3. Clean & Attractive List */}
        <main className="tx-list-area">
          {[1, 2, 3].map((item) => (
            <div key={item} className="tx-row-card">
              <div className="row-top">
                <div className="brand-box">
                  <div className="brand-img"><Hotel size={18} /></div>
                  <div>
                    <h4>Grand Hotel Panchgani</h4>
                    <span className="sub-type">Hotel • 13/12/24</span>
                  </div>
                </div>
                <div className="status-tag">
                  <CheckCircle size={12} /> Completed
                </div>
              </div>

              <div className="row-bottom-info">
                <div className="price-item">
                  <label>Original</label>
                  <span>₹5000</span>
                </div>
                <div className="price-item">
                  <label>Discount</label>
                  <span className="c-green">-₹500</span>
                </div>
                <div className="price-item">
                  <label>Final Pay</label>
                  <span className="c-navy">₹4500</span>
                </div>
                <button className="btn-icon-dl">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default TransactionPage;