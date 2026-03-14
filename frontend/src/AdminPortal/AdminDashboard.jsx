import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const initialForm = {
    restaurantName: '',
    ownerName: '',
    resMobile: '',
    ownerMobile: '',
    businessCategory: 'Food & Dining',
    email: '',
    password: '',
    area: ''
};

const AdminDashboard = () => {
    const [view, setView] = useState('list');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [partnerCategoryFilter, setPartnerCategoryFilter] = useState('All Categories');
    const [partners, setPartners] = useState([]);
    const [loggedInUsers, setLoggedInUsers] = useState([]);
    const [userStatsById, setUserStatsById] = useState({});
    const [quickTab, setQuickTab] = useState('overview');
    const [partnerSearch, setPartnerSearch] = useState('');
    const [memberSearch, setMemberSearch] = useState('');
    const navigate = useNavigate();
    const [dashboardStats, setDashboardStats] = useState({
        loggedInUsers: 0,
        totalRevenue: 0,
        netRevenue: 0,
        totalTransactions: 0
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
                netRevenue: Number(statsRes?.data?.stats?.netRevenue || 0),
                totalTransactions: Number(statsRes?.data?.stats?.totalTransactions || 0)
            });
            setLoggedInUsers(statsRes?.data?.users || []);
            setUserStatsById(statsRes?.data?.userStats || {});
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

    const searchedPartners = useMemo(() => {
        const query = partnerSearch.trim().toLowerCase();
        if (!query) return filteredPartners;
        return filteredPartners.filter((partner) => {
            const name = String(partner?.restaurantName || '').toLowerCase();
            const owner = String(partner?.ownerName || '').toLowerCase();
            const area = String(partner?.area || '').toLowerCase();
            return name.includes(query) || owner.includes(query) || area.includes(query);
        });
    }, [filteredPartners, partnerSearch]);

    const membersList = useMemo(() => {
        const query = memberSearch.trim().toLowerCase();
        return formattedUsers
            .map((user) => {
                const rawDate = user?.lastLoginAt ? new Date(user.lastLoginAt) : null;
                const joinDate = rawDate && !Number.isNaN(rawDate.getTime())
                    ? rawDate.toISOString().slice(0, 10)
                    : '-';
                const expiryDate = rawDate && !Number.isNaN(rawDate.getTime())
                    ? new Date(rawDate.getFullYear() + 1, rawDate.getMonth(), rawDate.getDate()).toISOString().slice(0, 10)
                    : '-';
                const isActive = joinDate !== '-' && new Date(expiryDate) >= new Date();
                const plan = String(user?.membershipPlan || 'single').toLowerCase();
                const type = plan.includes('family') ? 'family' : 'single';
                const stat = userStatsById[String(user.id)] || {};
                return {
                    id: user.id,
                    name: user.name || '-',
                    mobile: user.mobile || '-',
                    type,
                    joinDate,
                    expiryDate,
                    status: isActive ? 'Active' : 'Inactive',
                    transactions: Number(user.transactions ?? stat.totalTransactions ?? 0),
                    totalSaved: Number(user.totalSaved ?? stat.totalSavings ?? 0)
                };
            })
            .filter((member) => {
                if (!query) return true;
                const name = String(member.name || '').toLowerCase();
                const mobile = String(member.mobile || '').toLowerCase();
                return name.includes(query) || mobile.includes(query);
            });
    }, [formattedUsers, memberSearch, userStatsById]);

    return (
        <div className="admin-dashboard">
            <header className="admin-topbar">
                <div className="admin-topbar-left">
                    <div className="admin-logo">
                        <span className="admin-logo-mark" aria-hidden="true">
                            <i className="fa-solid fa-grid-2"></i>
                        </span>
                        <div className="admin-logo-text">
                            <h1>Main Admin Panel</h1>
                            <p>Panchgani Tourist Membership</p>
                        </div>
                    </div>
                </div>
                <div className="admin-topbar-right">
                    <button
                        type="button"
                        className="admin-topbar-action"
                        onClick={() => handleViewChange(view === 'add' ? 'list' : 'add')}
                    >
                        <i className={`fa-solid ${view === 'add' ? 'fa-xmark' : 'fa-user-plus'}`}></i>
                        {view === 'add' ? 'Close Form' : 'Add New Partner'}
                    </button>
                    <button type="button" className="admin-topbar-icon-btn" aria-label="Notifications">
                        <i className="fa-regular fa-bell"></i>
                        <span className="admin-topbar-dot" aria-hidden="true"></span>
                    </button>
                    <button type="button" className="admin-topbar-icon-btn" aria-label="Settings">
                        <i className="fa-solid fa-gear"></i>
                    </button>
                    <button type="button" className="admin-topbar-icon-btn" aria-label="Logout" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            </header>

            <div className="admin-body">
                <main className="content">
                    {view === 'list' ? (
                        <div className="partner-list-view">
                        <div className="admin-stats-row">
                            <div className="admin-stat-card">
                                <p>Logged In Users</p>
                                <h4>{dashboardStats.loggedInUsers}</h4>
                            </div>

                            <div className="admin-stat-card">
                                <p>Total Partners</p>
                                <h4>{partners.length}</h4>
                            </div>

                            <div className="admin-stat-card">
                                <p>Total Revenue</p>
                                <h4>Rs. {dashboardStats.totalRevenue}</h4>
                            </div>

                            <div className="admin-stat-card">
                                <p>Total Transactions</p>
                                <h4>{dashboardStats.totalTransactions}</h4>
                            </div>

                            <div className="admin-stat-card">
                                <p>Net Revenue</p>
                                <h4>Rs. {dashboardStats.netRevenue}</h4>
                            </div>
                        </div>

                        <div className="admin-today-row">
                            <div className="admin-today-card">
                                <p>Today&apos;s Active Users</p>
                                <h4>{dashboardStats.loggedInUsers}</h4>
                            </div>
                            <div className="admin-today-card">
                                <p>Today&apos;s Active Partners</p>
                                <h4>{partners.length}</h4>
                            </div>
                            <div className="admin-today-card">
                                <p>Today&apos;s Revenue</p>
                                <h4>Rs. {dashboardStats.totalRevenue}</h4>
                            </div>
                            <div className="admin-today-card">
                                <p>Today&apos;s Net Revenue</p>
                                <h4>Rs. {dashboardStats.netRevenue}</h4>
                            </div>
                            <div className="admin-today-card">
                                <p>Today&apos;s Transactions</p>
                                <h4>{dashboardStats.totalTransactions}</h4>
                            </div>
                        </div>

                        <div className="admin-quick-nav">
                            <button
                                type="button"
                                className={`admin-quick-pill ${quickTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setQuickTab('overview')}
                            >
                                <i className="fa-regular fa-chart-bar"></i>
                                Overview
                            </button>
                            <button
                                type="button"
                                className={`admin-quick-pill ${quickTab === 'partners' ? 'active' : ''}`}
                                onClick={() => setQuickTab('partners')}
                            >
                                <i className="fa-solid fa-building"></i>
                                Partners
                            </button>
                            <button
                                type="button"
                                className={`admin-quick-pill ${quickTab === 'members' ? 'active' : ''}`}
                                onClick={() => setQuickTab('members')}
                            >
                                <i className="fa-regular fa-user"></i>
                                Members
                            </button>
                            <button
                                type="button"
                                className={`admin-quick-pill ${quickTab === 'transactions' ? 'active' : ''}`}
                                onClick={() => setQuickTab('transactions')}
                            >
                                <i className="fa-regular fa-clipboard"></i>
                                Transactions
                            </button>
                        </div>

                        {quickTab === 'partners' ? (
                            <div className="partners-card">
                                <div className="partners-card-header">
                                    <h3>All Partners</h3>
                                    <div className="partners-toolbar">
                                        <div className="partners-search">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                            <input
                                                type="text"
                                                placeholder="Search partners..."
                                                value={partnerSearch}
                                                onChange={(e) => setPartnerSearch(e.target.value)}
                                            />
                                        </div>
                                        <button type="button" className="partners-filter-btn">
                                            <i className="fa-solid fa-filter"></i>
                                            Filter
                                        </button>
                                        <button
                                            type="button"
                                            className="partners-add-btn"
                                            onClick={() => handleViewChange('add')}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                            Add Partner
                                        </button>
                                        <button type="button" className="partners-export-btn">
                                            <i className="fa-solid fa-download"></i>
                                            Export
                                        </button>
                                    </div>
                                </div>

                                <div className="table-scroll">
                                    <table className="partners-table">
                                        <thead>
                                            <tr>
                                                <th>Partner</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                                <th>Transactions</th>
                                                <th>Revenue</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchedPartners.length > 0 ? (
                                                searchedPartners.map((partner) => (
                                                    <tr key={partner._id}>
                                                        <td>
                                                            <div className="partner-name">
                                                                <span>{partner.restaurantName || '-'}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="category-pill">
                                                                {partner.businessCategory || '-'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`status-pill ${String(partner.status || '').toLowerCase()}`}>
                                                                {String(partner.status || 'Pending').toLowerCase()}
                                                            </span>
                                                        </td>
                                                        <td>0</td>
                                                        <td>₹0</td>
                                                        <td>
                                                            <div className="partner-actions">
                                                                {partner.status !== 'Active' && (
                                                                    <button
                                                                        type="button"
                                                                        className="save-btn partner-action-btn"
                                                                        onClick={() => handleStatusChange(partner._id, 'Active')}
                                                                    >
                                                                        Activate
                                                                    </button>
                                                                )}
                                                                {partner.status !== 'Blocked' && (
                                                                    <button
                                                                        type="button"
                                                                        className="delete-btn partner-action-btn"
                                                                        onClick={() => handleStatusChange(partner._id, 'Blocked')}
                                                                    >
                                                                        Block
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    className="delete-btn partner-action-btn"
                                                                    onClick={() => handleDelete(partner._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="partner-next-btn"
                                                                    aria-label="Next"
                                                                    onClick={() => {
                                                                        const payload = { partnerId: partner._id, partner };
                                                                        localStorage.setItem('adminSelectedPartner', JSON.stringify(partner));
                                                                        navigate('/admin/info', { state: payload });
                                                                    }}
                                                                >
                                                                    <i className="fa-solid fa-arrow-right"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6">{loadingList ? 'Loading...' : 'No partners available.'}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : quickTab === 'members' ? (
                            <div className="members-card">
                                <div className="members-card-header">
                                    <div>
                                        <h3>All Members</h3>
                                        <small className="members-debug">
                                            Stats loaded: {Object.keys(userStatsById || {}).length}
                                        </small>
                                    </div>
                                    <div className="members-toolbar">
                                        <div className="members-search">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                            <input
                                                type="text"
                                                placeholder="Search members..."
                                                value={memberSearch}
                                                onChange={(e) => setMemberSearch(e.target.value)}
                                            />
                                        </div>
                                        <button type="button" className="members-export-btn">
                                            <i className="fa-solid fa-download"></i>
                                            Export
                                        </button>
                                    </div>
                                </div>

                                <div className="table-scroll">
                                    <table className="members-table">
                                        <thead>
                                            <tr>
                                                <th>Member</th>
                                                <th>Type</th>
                                                <th>Join Date</th>
                                                <th>Expiry</th>
                                                <th>Transactions</th>
                                                <th>Total Saved</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {membersList.length > 0 ? (
                                                membersList.map((member) => (
                                                    <tr key={member.id}>
                                                        <td>
                                                            <div className="member-name">
                                                                <span>{member.name}</span>
                                                                <small>{member.mobile}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`member-type-pill ${member.type}`}>{member.type}</span>
                                                        </td>
                                                        <td>{member.joinDate}</td>
                                                        <td>{member.expiryDate}</td>
                                                        <td>{member.transactions}</td>
                                                        <td className="member-saved">₹{member.totalSaved}</td>
                                                        <td>
                                                            <span className={`member-status ${member.status.toLowerCase()}`}>{member.status}</span>
                                                        </td>
                                                        <td>
                                                            <div className="member-actions">
                                                                <button
                                                                    type="button"
                                                                    className="members-delete-btn"
                                                                    onClick={() => handleUserDelete(member.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8">{loadingList ? 'Loading...' : 'No members found.'}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <>
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
                                                            <div className="partner-actions">
                                                                {partner.status !== 'Active' && (
                                                                    <button
                                                                        type="button"
                                                                        className="save-btn partner-action-btn"
                                                                        onClick={() => handleStatusChange(partner._id, 'Active')}
                                                                    >
                                                                        Activate
                                                                    </button>
                                                                )}
                                                                {partner.status !== 'Blocked' && (
                                                                    <button
                                                                        type="button"
                                                                        className="delete-btn partner-action-btn"
                                                                        onClick={() => handleStatusChange(partner._id, 'Blocked')}
                                                                    >
                                                                        Block
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    className="delete-btn partner-action-btn"
                                                                    onClick={() => handleDelete(partner._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
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
                            </>
                        )}
                    </div>
                ) : (
                        <div className="add-partner-view">
                        <div className="add-partner-header">
                            <h3>Register New Partner</h3>
                            <button
                                type="button"
                                className="add-partner-close"
                                onClick={() => handleViewChange('list')}
                                aria-label="Close add partner form"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form className="professional-form" onSubmit={handleAddPartner}>
                            <div className="form-grid">
                                <input name="restaurantName" placeholder="Restaurant Name" value={formData.restaurantName} onChange={handleInputChange} required />
                                <input name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleInputChange} required />
                                <input name="resMobile" placeholder="Restaurant Mobile" value={formData.resMobile} onChange={handleInputChange} required />
                                <input name="ownerMobile" placeholder="Owner Mobile" value={formData.ownerMobile} onChange={handleInputChange} required />

                                <select name="businessCategory" value={formData.businessCategory} onChange={handleInputChange} required>
                                    <option>Food & Dining</option>
                                    <option>Activities & Adventure</option>
                                    <option>Local Stores & Gift House</option>
                                    <option>Stay & Hotels</option>
                                </select>

                                <input type="file" onChange={(e) => setResImageFile(e.target.files?.[0] || null)} />
                                <input name="email" type="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} required />
                                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                                <input name="area" placeholder="Area" value={formData.area} onChange={handleInputChange} required />
                            </div>

                            <button type="submit" className="save-btn" disabled={savingPartner}>
                                {savingPartner ? 'Adding...' : 'Add Partner'}
                            </button>
                        </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
