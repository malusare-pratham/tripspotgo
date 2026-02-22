import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminDashboard = () => {
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [partners, setPartners] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        loggedInUsers: 0,
        totalRevenue: 0,
        netRevenue: 0
    });
    const [loggedInUsers, setLoggedInUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [lastSyncAt, setLastSyncAt] = useState(null);
    const [formData, setFormData] = useState({
        restaurantName: '', ownerName: '', resMobile: '', ownerMobile: '',
        foodType: 'Veg', businessCategory: 'Food & Dining', openTime: '', closeTime: '', email: '', password: '',
        address: '', locationLink: '', pincode: '', area: ''
    });
    const [image, setImage] = useState(null);

    // पार्टनर्सची लिस्ट लोड करणे
    const fetchPartners = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/partners`);
            setPartners(res.data);
            setLastSyncAt(new Date());
        } catch (err) {
            console.error("Error fetching partners");
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`);
            setDashboardStats(res.data?.stats || { loggedInUsers: 0, totalRevenue: 0, netRevenue: 0 });
            setLoggedInUsers(Array.isArray(res.data?.users) ? res.data.users : []);
        } catch (_err) {
            setDashboardStats({ loggedInUsers: 0, totalRevenue: 0, netRevenue: 0 });
            setLoggedInUsers([]);
        }
    };

    useEffect(() => {
        fetchPartners();
        fetchDashboardStats();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('resImage', image);

        try {
            await axios.post(`${API_BASE_URL}/api/admin/add-partner`, data);
            alert("Partner Added Successfully!");
            setView('list');
            fetchPartners();
            fetchDashboardStats();
        } catch (err) {
            const backendMessage = err.response?.data?.message;
            const backendError = err.response?.data?.error;
            alert(backendError || backendMessage || "Error adding partner");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
        try {
            await axios.put(`${API_BASE_URL}/api/admin/update-status/${id}`, { status: newStatus });
            fetchPartners();
        } catch (err) {
            alert("Error updating status");
        }
    };

    const deletePartner = async (id, restaurantName) => {
        const confirmed = window.confirm(`Delete partner "${restaurantName}"?`);
        if (!confirmed) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/admin/delete-partner/${id}`);
            fetchPartners();
            fetchDashboardStats();
        } catch (_err) {
            alert('Error deleting partner');
        }
    };

    const partnerStats = useMemo(() => {
        const total = partners.length;
        const active = partners.filter((p) => p.status === 'Active').length;
        const blocked = partners.filter((p) => p.status === 'Blocked').length;
        const pending = partners.filter((p) => p.status === 'Pending').length;
        return { total, active, blocked, pending };
    }, [partners]);

    const filteredPartners = useMemo(() => {
        return partners.filter((p) => {
            const matchSearch =
                !searchText ||
                p.restaurantName?.toLowerCase().includes(searchText.toLowerCase()) ||
                p.ownerName?.toLowerCase().includes(searchText.toLowerCase()) ||
                p.area?.toLowerCase().includes(searchText.toLowerCase()) ||
                p.email?.toLowerCase().includes(searchText.toLowerCase());

            const matchStatus = statusFilter === 'All' || p.status === statusFilter;
            const currentCategory = p.businessCategory || 'Food & Dining';
            const matchCategory = categoryFilter === 'All' || currentCategory === categoryFilter;

            return matchSearch && matchStatus && matchCategory;
        });
    }, [partners, searchText, statusFilter, categoryFilter]);

    const exportPartnersCsv = () => {
        const header = ['Restaurant', 'Owner', 'Area', 'Category', 'Status', 'Email'];
        const rows = filteredPartners.map((p) => [
            p.restaurantName || '',
            p.ownerName || '',
            p.area || '',
            p.businessCategory || 'Food & Dining',
            p.status || '',
            p.email || ''
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'partners.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2>MagicPoint Admin</h2>
                <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>Partner List</button>
                <button onClick={() => setView('add')} className={view === 'add' ? 'active' : ''}>Add New Partner</button>
                <button onClick={() => { localStorage.clear(); window.location.href='/admin-login'; }} className="logout-btn">Logout</button>
            </aside>

            <main className="content">
                {view === 'list' ? (
                    <div className="partner-list-view">
                        <div className="admin-stats-row partner-stats-row">
                            <div className="admin-stat-card">
                                <p>Total Partners</p>
                                <h4>{partnerStats.total}</h4>
                            </div>
                            <div className="admin-stat-card">
                                <p>Active Partners</p>
                                <h4>{partnerStats.active}</h4>
                            </div>
                            <div className="admin-stat-card">
                                <p>Blocked Partners</p>
                                <h4>{partnerStats.blocked}</h4>
                            </div>
                            <div className="admin-stat-card">
                                <p>Pending Partners</p>
                                <h4>{partnerStats.pending}</h4>
                            </div>
                        </div>

                        <div className="admin-stats-row">
                            <div className="admin-stat-card">
                                <p>Logged In Users</p>
                                <h4>{dashboardStats.loggedInUsers}</h4>
                            </div>
                            <div className="admin-stat-card">
                                <p>Total Revenue</p>
                                <h4>₹{dashboardStats.totalRevenue}</h4>
                            </div>
                            <div className="admin-stat-card">
                                <p>Net Revenue</p>
                                <h4>₹{dashboardStats.netRevenue}</h4>
                            </div>
                        </div>

                        <div className="admin-toolbar">
                            <input
                                type="text"
                                placeholder="Search by restaurant, owner, area, email"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Pending">Pending</option>
                            </select>
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                <option value="All">All Categories</option>
                                <option value="Food & Dining">Food & Dining</option>
                                <option value="Activities & Adventure">Activities & Adventure</option>
                                <option value="Local Stores & Gift House">Local Stores & Gift House</option>
                                <option value="Stay & Hotels">Stay & Hotels</option>
                            </select>
                            <button className="action-btn" onClick={fetchPartners}>Refresh</button>
                            <button className="action-btn" onClick={exportPartnersCsv}>Export CSV</button>
                        </div>
                        {lastSyncAt && <p className="sync-text">Last sync: {lastSyncAt.toLocaleString()}</p>}

                        <h3>Logged In Users List</h3>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loggedInUsers.length > 0 ? loggedInUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.mobile}</td>
                                        <td>{u.email}</td>
                                        <td>{u.membershipPlan}</td>
                                        <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '-'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5">No logged-in users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <h3>All Registered Partners</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Restaurant</th>
                                    <th>Owner</th>
                                    <th>Area</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPartners.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.restaurantName}</td>
                                        <td>{p.ownerName}</td>
                                        <td>{p.area}</td>
                                        <td>{p.businessCategory || 'Food & Dining'}</td>
                                        <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                                        <td>
                                            <button onClick={() => toggleStatus(p._id, p.status)} className="action-btn">
                                                {p.status === 'Active' ? 'Block' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => deletePartner(p._id, p.restaurantName)}
                                                className="action-btn delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPartners.length === 0 && (
                                    <tr>
                                        <td colSpan="6">No partners match current filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="add-partner-view">
                        <h3>Register New Partner</h3>
                        <form onSubmit={handleSubmit} className="professional-form">
                            <div className="form-grid">
                                <input name="restaurantName" placeholder="Restaurant Name" onChange={handleChange} required />
                                <input name="ownerName" placeholder="Owner Name" onChange={handleChange} required />
                                <input name="resMobile" placeholder="Restaurant Mobile" onChange={handleChange} required />
                                <input name="ownerMobile" placeholder="Owner Mobile" onChange={handleChange} required />
                                <select name="foodType" onChange={handleChange}>
                                    <option value="Veg">Veg</option>
                                    <option value="Non-Veg">Non-Veg</option>
                                    <option value="Both">Both</option>
                                </select>
                                <select name="businessCategory" onChange={handleChange}>
                                    <option value="Food & Dining">Food & Dining</option>
                                    <option value="Activities & Adventure">Activities & Adventure</option>
                                    <option value="Local Stores & Gift House">Local Stores & Gift House</option>
                                    <option value="Stay & Hotels">Stay & Hotels</option>
                                </select>
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                                <input name="openTime" type="time" onChange={handleChange} required />
                                <input name="closeTime" type="time" onChange={handleChange} required />
                                <input name="email" type="email" placeholder="Email ID" onChange={handleChange} required />
                                <input name="password" type="password" placeholder="Partner Login Password" onChange={handleChange} required />
                                <input name="pincode" placeholder="Pincode" onChange={handleChange} required />
                                <input name="area" placeholder="Area" onChange={handleChange} required />
                                <input name="locationLink" placeholder="Google Map Link" onChange={handleChange} />
                            </div>
                            <textarea name="address" placeholder="Full Address" onChange={handleChange} required></textarea>
                            <button type="submit" className="save-btn">Add Partner</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
