import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, TrendingUp, DollarSign, Users, FileText, Search, RefreshCw } from 'lucide-react';
import './PartnerDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PartnerDashboard = () => {
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, discounts: 0, customers: 0, avgBill: 0 });
    const [transactions, setTransactions] = useState([]);
    const [txSearch, setTxSearch] = useState('');
    const [lastSynced, setLastSynced] = useState(null);

    const fetchData = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/partner-transactions/${id}`);
            setTransactions(res.data.transactions);
            setStats(res.data.stats);
            setLastSynced(new Date());
        } catch (err) {
            console.error('Error loading dashboard data', err);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('partnerInfo');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setPartnerInfo(parsedData);
            setIsOpen((parsedData.businessStatus || 'OPEN') === 'OPEN');
            fetchData(parsedData.id);
        }
    }, []);

    const toggleBusinessStatus = async () => {
        if (!partnerInfo?.id) return;

        const nextStatus = isOpen ? 'CLOSED' : 'OPEN';
        try {
            const res = await axios.put(
                `${API_BASE_URL}/api/admin/partner-business-status/${partnerInfo.id}`,
                { businessStatus: nextStatus }
            );

            setIsOpen(nextStatus === 'OPEN');
            if (res?.data?.partner) {
                setPartnerInfo(res.data.partner);
                localStorage.setItem('partnerInfo', JSON.stringify(res.data.partner));
            }

            alert(`Business is now ${nextStatus}`);
        } catch (_err) {
            alert('Error updating status');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/partner-login';
    };

    if (!partnerInfo) return <div className="loading">Loading Dashboard...</div>;

    const filteredTransactions = transactions.filter((t) => {
        const query = txSearch.toLowerCase();
        if (!query) return true;
        return (
            String(t.userName || '').toLowerCase().includes(query) ||
            String(t.billAmount || '').includes(query) ||
            new Date(t.createdAt).toLocaleString().toLowerCase().includes(query)
        );
    });

    return (
        <div className="partner-container">
            <nav className="partner-nav">
                <div className="nav-left">
                    <div className="store-icon"><LayoutDashboard size={20} /></div>
                    <div>
                        <h4 className="m-0">Partner Portal</h4>
                        <small>{partnerInfo.name}</small>
                    </div>
                </div>
                <div className="nav-right">
                    <button className="icon-btn" onClick={() => fetchData(partnerInfo.id)} title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <LogOut className="nav-icon" onClick={handleLogout} style={{ cursor: 'pointer' }} />
                </div>
            </nav>

            <div className={`status-band ${isOpen ? 'bg-green' : 'bg-red'}`}>
                <div className="status-info">
                    <div className="power-icon">⏻</div>
                    <div>
                        <strong>Business Status: {isOpen ? 'OPEN' : 'CLOSED'}</strong>
                        <p>{isOpen ? 'You are currently accepting discount redemptions' : 'You are currently not accepting redemptions'}</p>
                    </div>
                </div>
                <div className="toggle-container">
                    <span>{isOpen ? 'Open' : 'Closed'}</span>
                    <label className="switch">
                        <input type="checkbox" checked={isOpen} onChange={toggleBusinessStatus} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="partner-card profile-card">
                <div className="profile-info">
                    <div className="store-big-icon"><LayoutDashboard size={40} /></div>
                    <div>
                        <h3>{partnerInfo.name}</h3>
                        <div className="badges">
                            <span className="badge hotel">Partner</span>
                            <span className="badge active">Active</span>
                        </div>
                        <p>Email: {partnerInfo.email}</p>
                        <p>Member since 2026</p>
                    </div>
                </div>
                {lastSynced && <span className="sync-chip">Last sync: {lastSynced.toLocaleTimeString()}</span>}
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header"><span>Total Revenue</span> <TrendingUp size={18} color="green" /></div>
                    <h2>₹{stats.revenue}</h2>
                    <small className="text-green">+0% from yesterday</small>
                </div>
                <div className="stat-card">
                    <div className="stat-header"><span>Discounts Given</span> <DollarSign size={18} color="gold" /></div>
                    <h2>₹{stats.discounts}</h2>
                    <small>{stats.revenue > 0 ? ((stats.discounts / stats.revenue) * 100).toFixed(1) : 0}% of revenue</small>
                </div>
                <div className="stat-card">
                    <div className="stat-header"><span>Customers</span> <Users size={18} color="blue" /></div>
                    <h2>{stats.customers}</h2>
                    <small className="text-green">Total transactions</small>
                </div>
                <div className="stat-card">
                    <div className="stat-header"><span>Avg. Bill</span> <FileText size={18} color="purple" /></div>
                    <h2>₹{stats.avgBill}</h2>
                    <small>Per transaction</small>
                </div>
            </div>

            <div className="partner-card">
                <div className="card-header">
                    <h4>Recent Transactions</h4>
                    <div className="tx-search">
                        <Search size={14} />
                        <input
                            type="text"
                            placeholder="Search transactions"
                            value={txSearch}
                            onChange={(e) => setTxSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="transaction-list">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((t, i) => (
                            <div key={i} className="transaction-item">
                                <div className="user-avatar">{t.userName ? t.userName[0] : 'U'}</div>
                                <div className="user-details">
                                    <strong>{t.userName || 'Customer'}</strong>
                                    <small>{new Date(t.createdAt).toLocaleString()}</small>
                                </div>
                                <div className="price-details">
                                    <strong>₹{t.billAmount}</strong>
                                    <span className="text-green">-₹{t.discountAmount} Saved</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No matching transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;
