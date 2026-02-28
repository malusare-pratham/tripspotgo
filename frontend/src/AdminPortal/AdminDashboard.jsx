import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const initialForm = {
    restaurantName: '',
    ownerName: '',
    resMobile: '',
    ownerMobile: '',
    foodType: 'Veg',
    businessCategory: 'Food & Dining',
    openTime: '',
    closeTime: '',
    email: '',
    password: '',
    pincode: '',
    area: '',
    locationLink: '',
    address: ''
};

const AdminDashboard = () => {
    const [view, setView] = useState('list');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [partnerCategoryFilter, setPartnerCategoryFilter] = useState('All Categories');
    const [partners, setPartners] = useState([]);
    const [loggedInUsers, setLoggedInUsers] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        loggedInUsers: 0,
        totalRevenue: 0,
        netRevenue: 0
    });
    const [formData, setFormData] = useState(initialForm);
    const [resImageFile, setResImageFile] = useState(null);
    const [loadingList, setLoadingList] = useState(true);
    const [savingPartner, setSavingPartner] = useState(false);

    const fetchDashboard = async () => {
        try {
            setLoadingList(true);
            const [statsRes, partnersRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`),
                axios.get(`${API_BASE_URL}/api/admin/partners`)
            ]);

            setDashboardStats({
                loggedInUsers: Number(statsRes?.data?.stats?.loggedInUsers || 0),
                totalRevenue: Number(statsRes?.data?.stats?.totalRevenue || 0),
                netRevenue: Number(statsRes?.data?.stats?.netRevenue || 0)
            });
            setLoggedInUsers(statsRes?.data?.users || []);
            setPartners(Array.isArray(partnersRes?.data) ? partnersRes.data : []);
        } catch (error) {
            alert(error?.response?.data?.message || 'Error loading admin dashboard data');
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/admin-login';
    };

    const handleViewChange = (nextView) => {
        setView(nextView);
        setMobileNavOpen(false);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/update-status/${id}`, { status });
            await fetchDashboard();
        } catch (error) {
            alert(error?.response?.data?.message || 'Error updating partner status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this partner?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/delete-partner/${id}`);
            await fetchDashboard();
        } catch (error) {
            alert(error?.response?.data?.message || 'Error deleting partner');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPartner = async (e) => {
        e.preventDefault();
        try {
            setSavingPartner(true);
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value);
            });
            if (resImageFile) payload.append('resImage', resImageFile);

            await axios.post(`${API_BASE_URL}/api/admin/add-partner`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setFormData(initialForm);
            setResImageFile(null);
            setView('list');
            await fetchDashboard();
        } catch (error) {
            const backendMessage = error?.response?.data?.message;
            const backendError = error?.response?.data?.error;
            alert(backendError ? `${backendMessage}: ${backendError}` : (backendMessage || 'Error adding partner'));
        } finally {
            setSavingPartner(false);
        }
    };

    const handleUserDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/delete-user/${id}`);
            await fetchDashboard();
        } catch (error) {
            alert(error?.response?.data?.message || 'Error deleting user');
        }
    };

    const formattedUsers = useMemo(
        () =>
            loggedInUsers.map((user) => ({
                ...user,
                formattedLastLogin: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'
            })),
        [loggedInUsers]
    );

    const partnerCategoryOptions = useMemo(() => {
        const unique = Array.from(
            new Set(
                partners
                    .map((partner) => String(partner?.businessCategory || '').trim())
                    .filter(Boolean)
            )
        );
        return ['All Categories', ...unique];
    }, [partners]);

    const filteredPartners = useMemo(() => {
        if (partnerCategoryFilter === 'All Categories') return partners;
        return partners.filter(
            (partner) => String(partner?.businessCategory || '').trim() === partnerCategoryFilter
        );
    }, [partners, partnerCategoryFilter]);

    return (
        <div className="admin-dashboard">
            <aside className={`sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-top">
                    <h2>MagicPoint Admin</h2>
                    <button
                        type="button"
                        className="sidebar-toggle"
                        aria-label="Toggle admin menu"
                        onClick={() => setMobileNavOpen((prev) => !prev)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="sidebar-nav">
                    <button
                        onClick={() => handleViewChange('list')}
                        className={view === 'list' ? 'active' : ''}
                    >
                        Partner List
                    </button>

                    <button
                        onClick={() => handleViewChange('add')}
                        className={view === 'add' ? 'active' : ''}
                    >
                        Add New Partner
                    </button>

                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="content">
                {view === 'list' ? (
                    <div className="partner-list-view">
                        <div className="admin-stats-row">
                            <div className="admin-stat-card">
                                <p>Logged In Users</p>
                                <h4>{dashboardStats.loggedInUsers}</h4>
                            </div>

                            <div className="admin-stat-card">
                                <p>Total Revenue</p>
                                <h4>Rs. {dashboardStats.totalRevenue}</h4>
                            </div>

                            <div className="admin-stat-card">
                                <p>Net Revenue</p>
                                <h4>Rs. {dashboardStats.netRevenue}</h4>
                            </div>
                        </div>

                        <h3>Logged In Users List</h3>
                        <div className="table-scroll">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Mobile</th>
                                        <th>Email</th>
                                        <th>Plan</th>
                                        <th>Last Login</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formattedUsers.length > 0 ? (
                                        formattedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name || '-'}</td>
                                                <td>{user.mobile || '-'}</td>
                                                <td>{user.email || '-'}</td>
                                                <td>{user.membershipPlan || '-'}</td>
                                                <td>{user.formattedLastLogin}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() => handleUserDelete(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">{loadingList ? 'Loading...' : 'No logged-in users found.'}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-partner-header">
                            <h3>All Registered Partners</h3>
                            <select
                                value={partnerCategoryFilter}
                                onChange={(e) => setPartnerCategoryFilter(e.target.value)}
                                aria-label="Filter partners by category"
                            >
                                {partnerCategoryOptions.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Restaurant</th>
                                        <th>Owner</th>
                                        <th>Area</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPartners.length > 0 ? (
                                        filteredPartners.map((partner) => (
                                            <tr key={partner._id}>
                                                <td>{partner.restaurantName || '-'}</td>
                                                <td>{partner.ownerName || '-'}</td>
                                                <td>{partner.area || '-'}</td>
                                                <td>
                                                    <span className={`status-badge ${partner.status}`}>{partner.status}</span>
                                                </td>
                                                <td>
                                                    {partner.status !== 'Active' && (
                                                        <button
                                                            type="button"
                                                            className="save-btn"
                                                            onClick={() => handleStatusChange(partner._id, 'Active')}
                                                        >
                                                            Activate
                                                        </button>
                                                    )}
                                                    {partner.status !== 'Blocked' && (
                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() => handleStatusChange(partner._id, 'Blocked')}
                                                        >
                                                            Block
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() => handleDelete(partner._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">{loadingList ? 'Loading...' : 'No partners available for selected category.'}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="add-partner-view">
                        <h3>Register New Partner</h3>

                        <form className="professional-form" onSubmit={handleAddPartner}>
                            <div className="form-grid">
                                <input name="restaurantName" placeholder="Restaurant Name" value={formData.restaurantName} onChange={handleInputChange} required />
                                <input name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleInputChange} required />
                                <input name="resMobile" placeholder="Restaurant Mobile" value={formData.resMobile} onChange={handleInputChange} required />
                                <input name="ownerMobile" placeholder="Owner Mobile" value={formData.ownerMobile} onChange={handleInputChange} required />

                                <select name="foodType" value={formData.foodType} onChange={handleInputChange} required>
                                    <option>Veg</option>
                                    <option>Non-Veg</option>
                                    <option>Both</option>
                                </select>

                                <select name="businessCategory" value={formData.businessCategory} onChange={handleInputChange} required>
                                    <option>Food & Dining</option>
                                    <option>Activities & Adventure</option>
                                    <option>Local Stores & Gift House</option>
                                    <option>Stay & Hotels</option>
                                </select>

                                <input type="file" onChange={(e) => setResImageFile(e.target.files?.[0] || null)} />
                                <input name="openTime" type="time" value={formData.openTime} onChange={handleInputChange} required />
                                <input name="closeTime" type="time" value={formData.closeTime} onChange={handleInputChange} required />
                                <input name="email" type="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} required />
                                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                                <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} required />
                                <input name="area" placeholder="Area" value={formData.area} onChange={handleInputChange} required />
                                <input name="locationLink" placeholder="Google Map Link" value={formData.locationLink} onChange={handleInputChange} />
                            </div>

                            <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleInputChange} required></textarea>

                            <button type="submit" className="save-btn" disabled={savingPartner}>
                                {savingPartner ? 'Adding...' : 'Add Partner'}
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
