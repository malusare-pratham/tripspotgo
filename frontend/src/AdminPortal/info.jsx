import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LuPenLine, 
  LuRefreshCw, 
  LuLogOut, 
  LuSearch, 
  LuTrendingUp, 
  LuUsers, 
  LuFile
} from "react-icons/lu";
import './info.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const resolvePartnerId = (payload) => {
  const id = String(payload?.id || payload?._id || '').trim();
  if (id) return id;
  return String(localStorage.getItem('selectedPartnerId') || '').trim();
};

const formatCurrency = (value) => `₹${Number(value || 0).toFixed(0)}`;

const Info = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [stats, setStats] = useState({ revenue: 0, discounts: 0, customers: 0, avgBill: 0 });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const partnerId = useMemo(() => {
    const fromState = String(location?.state?.partnerId || '').trim();
    if (fromState) return fromState;
    return resolvePartnerId(partnerInfo);
  }, [location?.state?.partnerId, partnerInfo]);

  const fetchStats = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/partner-transactions/${id}`);
      setTransactions(Array.isArray(res?.data?.transactions) ? res.data.transactions : []);
      setStats(res?.data?.stats || { revenue: 0, discounts: 0, customers: 0, avgBill: 0 });
    } catch (_error) {
      setTransactions([]);
      setStats({ revenue: 0, discounts: 0, customers: 0, avgBill: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fromState = String(location?.state?.partnerId || '').trim();
    if (fromState) {
      localStorage.setItem('selectedPartnerId', fromState);
    }
    if (location?.state?.partner) {
      localStorage.setItem('adminSelectedPartner', JSON.stringify(location.state.partner));
      setPartnerInfo(location.state.partner);
      return;
    }

    try {
      const adminSaved = localStorage.getItem('adminSelectedPartner');
      if (adminSaved) {
        const parsed = JSON.parse(adminSaved);
        if (parsed) {
          setPartnerInfo(parsed);
          return;
        }
      }
    } catch (_error) {
      // ignore parse error
    }

    try {
      const saved = localStorage.getItem('partnerInfo');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPartnerInfo(parsed || null);
        return;
      }
    } catch (_error) {
      // ignore parse error
    }
    setPartnerInfo((prev) => prev || null);
  }, [location?.state?.partnerId, location?.state?.partner]);

  useEffect(() => {
    const loadPartnerMeta = async (id) => {
      if (!id) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/partners`);
        const list = Array.isArray(res?.data) ? res.data : [];
        const matched = list.find((p) => String(p?._id || '') === String(id));
        if (matched) {
          setPartnerInfo((prev) => ({ ...prev, ...matched }));
        }
      } catch (_error) {
        // ignore
      }
    };
    if (partnerId) {
      loadPartnerMeta(partnerId);
    }
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      fetchStats(partnerId);
    }
  }, [partnerId]);

  const revenueChange = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return 0;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    let todayRevenue = 0;
    let yesterdayRevenue = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.createdAt);
      const amount = Number(tx.billAmount) || 0;
      if (txDate >= todayStart) {
        todayRevenue += amount;
        return;
      }
      if (txDate >= yesterdayStart && txDate < todayStart) {
        yesterdayRevenue += amount;
      }
    });

    if (yesterdayRevenue === 0) return todayRevenue > 0 ? 100 : 0;
    return ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
  }, [transactions]);

  const revenueChangePrefix = revenueChange > 0 ? '+' : '';
  const discountPercent = stats.revenue > 0 ? ((stats.discounts / stats.revenue) * 100) : 0;
  const partnerCommission = stats.revenue * 0.15;
  const statsCards = [
    { title: "Total Revenue", value: formatCurrency(stats.revenue), sub: `${revenueChangePrefix}${revenueChange.toFixed(1)}% from yesterday`, icon: <LuTrendingUp />, color: "green" },
    { title: "Discounts Given", value: formatCurrency(stats.discounts), sub: `${discountPercent.toFixed(1)}% of revenue`, icon: "$", color: "yellow" },
    { title: "Customers", value: String(stats.customers || 0), sub: "Total transactions", icon: <LuUsers />, color: "blue" },
    { title: "Avg. Bill", value: formatCurrency(stats.avgBill), sub: "Per transaction", icon: <LuFile />, color: "purple" },
    { title: "Partner Commission", value: formatCurrency(partnerCommission), sub: "15% of total revenue", icon: <LuFile />, color: "purple" },
  ];

  return (
    <div className="dashboard-container">
      <div className="info-topbar">
        <button type="button" className="info-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
          Back
        </button>
      </div>

      {/* Top Profile Card */}
      <div className="profile-card">
        <div className="profile-content">
          <div className="title-section">
            <div className="icon-badge">
              <LuFile className="check-icon" />
            </div>
            <h1>{partnerInfo?.name || partnerInfo?.restaurantName || 'Partner'}</h1>
          </div>
          <div className="status-badges">
            <span className="badge partner">Partner</span>
            <span className={`badge ${String(partnerInfo?.businessStatus || 'OPEN').toUpperCase() === 'OPEN' ? 'active' : 'inactive'}`}>
              {String(partnerInfo?.businessStatus || 'OPEN').toUpperCase() === 'OPEN' ? 'Active' : 'Closed'}
            </span>
          </div>
          <p className="description">Manage approvals faster and keep your customer experience smooth.</p>
        </div>
        <div className="action-buttons">
          {/* actions removed as requested */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <span className={`stat-icon-box ${stat.color}`}>{stat.icon}</span>
            </div>
            <h2 className="stat-value">{stat.value}</h2>
            <p className="stat-subtext">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions Section */}
      <div className="transactions-card">
        <div className="trans-header">
          <div className="trans-title-wrapper">
            <h2>Recent Transactions</h2>
            <div className="title-underline"></div>
          </div>
          <div className="search-box">
            <LuSearch className="search-icon" />
            <input type="text" placeholder="Search transactions" />
          </div>
        </div>
        <div className="empty-state">
          <p>{isLoading ? 'Loading transactions...' : 'No matching transactions found.'}</p>
        </div>
      </div>
    </div>
  );
};

export default Info;


