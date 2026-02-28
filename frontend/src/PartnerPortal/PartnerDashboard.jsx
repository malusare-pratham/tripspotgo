import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, TrendingUp, DollarSign, Users, FileText, Search, RefreshCw, CheckCircle2, XCircle, ExternalLink, Eye, Pencil, Power, BadgeCheck } from 'lucide-react';
import './PartnerDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const emptyMenuItem = () => ({ name: '', description: '', price: '', image: '', file: null });

const defaultInfoForm = {
    email: '',
    memberSince: '2026',
    logo: '',
    restaurantName: '',
    subtitle: '',
    foodType: 'Veg',
    description: '',
    rating: '4.2',
    location: '',
    openTime: '',
    closeTime: '',
    callNumber: '',
    directionLink: '',
    menu: {
        vegMenu: [],
        nonVegMenu: [],
        cafeMenu: []
    },
    photos: [],
    videos: []
};

const resolvePartnerId = (payload) => {
    const id = String(payload?.id || payload?._id || '').trim();
    if (id) return id;
    return String(localStorage.getItem('selectedPartnerId') || '').trim();
};

const PartnerDashboard = () => {
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [infoForm, setInfoForm] = useState(defaultInfoForm);
    const [logoFile, setLogoFile] = useState(null);
    const [photoFiles, setPhotoFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [savingInfo, setSavingInfo] = useState(false);
    const [stats, setStats] = useState({ revenue: 0, discounts: 0, customers: 0, avgBill: 0 });
    const [transactions, setTransactions] = useState([]);
    const [pendingBills, setPendingBills] = useState([]);
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

    const fetchPendingBills = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/partner-pending-bills/${id}`);
            const directPending = Array.isArray(res?.data?.pendingBills) ? res.data.pendingBills : [];

            if (directPending.length > 0) {
                setPendingBills(directPending);
                return;
            }

            // Fallback: if stored partner id is stale, resolve fresh id by partner name.
            const partnerName = String(partnerInfo?.name || '').trim().toLowerCase();
            if (!partnerName) {
                setPendingBills([]);
                return;
            }

            const partnersRes = await axios.get(`${API_BASE_URL}/api/admin/partners`);
            const allPartners = Array.isArray(partnersRes?.data) ? partnersRes.data : [];
            const matched = allPartners.find((p) => String(p?.restaurantName || '').trim().toLowerCase() === partnerName);

            if (!matched?._id || String(matched._id) === String(id)) {
                setPendingBills([]);
                return;
            }

            const fallbackRes = await axios.get(`${API_BASE_URL}/api/admin/partner-pending-bills/${matched._id}`);
            setPendingBills(Array.isArray(fallbackRes?.data?.pendingBills) ? fallbackRes.data.pendingBills : []);
        } catch (_err) {
            setPendingBills([]);
        }
    };

    const fetchPartnerInfoForm = async (id, basePartner) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/partner-info/${id}`);
            const info = res?.data?.data;
            if (!info) {
                setInfoForm({
                    ...defaultInfoForm,
                    email: basePartner?.email || '',
                    restaurantName: basePartner?.name || ''
                });
                return;
            }

            setInfoForm({
                email: info.email || basePartner?.email || '',
                memberSince: info.memberSince || '2026',
                logo: info.logo || '',
                restaurantName: info.restaurantName || basePartner?.name || '',
                subtitle: info.subtitle || '',
                foodType: info.foodType || 'Veg',
                description: info.description || '',
                rating: String(info.rating ?? '4.2'),
                location: info.location || '',
                openTime: info.openTime || '',
                closeTime: info.closeTime || '',
                callNumber: info.callNumber || '',
                directionLink: info.directionLink || '',
                menu: {
                    vegMenu: Array.isArray(info?.menu?.vegMenu) ? info.menu.vegMenu.map((x) => ({ ...x, file: null })) : [],
                    nonVegMenu: Array.isArray(info?.menu?.nonVegMenu) ? info.menu.nonVegMenu.map((x) => ({ ...x, file: null })) : [],
                    cafeMenu: Array.isArray(info?.menu?.cafeMenu) ? info.menu.cafeMenu.map((x) => ({ ...x, file: null })) : []
                },
                photos: Array.isArray(info.photos) ? info.photos : [],
                videos: Array.isArray(info.videos) ? info.videos : []
            });
        } catch (_err) {
            setInfoForm({
                ...defaultInfoForm,
                email: basePartner?.email || '',
                restaurantName: basePartner?.name || ''
            });
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('partnerInfo');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            const resolvedId = resolvePartnerId(parsedData);
            const normalized = { ...parsedData, id: resolvedId };
            setPartnerInfo(normalized);
            setIsOpen((normalized.businessStatus || 'OPEN') === 'OPEN');
            if (resolvedId) {
                fetchData(resolvedId);
                fetchPendingBills(resolvedId);
                fetchPartnerInfoForm(resolvedId, normalized);
            }
        }
    }, []);

    useEffect(() => {
        if (!partnerInfo?.id) return undefined;
        const intervalId = setInterval(() => {
            fetchPendingBills(partnerInfo.id);
        }, 4000);
        return () => clearInterval(intervalId);
    }, [partnerInfo?.id]);

    const reviewPendingBill = async (billId, decision) => {
        if (!partnerInfo?.id || !billId) return;
        try {
            await axios.put(`${API_BASE_URL}/api/admin/partner-pending-bills/${partnerInfo.id}/${billId}`, { decision });
            await fetchPendingBills(partnerInfo.id);
            await fetchData(partnerInfo.id);
        } catch (_error) {
            alert('Error updating approval');
        }
    };

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

    const setField = (key, value) => {
        setInfoForm((prev) => ({ ...prev, [key]: value }));
    };

    const setMenuField = (section, idx, key, value) => {
        setInfoForm((prev) => {
            const next = { ...prev, menu: { ...prev.menu } };
            const items = [...(next.menu[section] || [])];
            items[idx] = { ...items[idx], [key]: value };
            next.menu[section] = items;
            return next;
        });
    };

    const addMenuItem = (section) => {
        setInfoForm((prev) => ({
            ...prev,
            menu: {
                ...prev.menu,
                [section]: [...(prev.menu[section] || []), emptyMenuItem()]
            }
        }));
    };

    const removeMenuItem = (section, idx) => {
        setInfoForm((prev) => ({
            ...prev,
            menu: {
                ...prev.menu,
                [section]: (prev.menu[section] || []).filter((_, i) => i !== idx)
            }
        }));
    };

    const handleSavePartnersInfo = async () => {
        if (!partnerInfo?.id) return;
        try {
            setSavingInfo(true);
            const formData = new FormData();

            formData.append('email', infoForm.email.trim());
            formData.append('memberSince', infoForm.memberSince.trim());
            formData.append('logo', infoForm.logo.trim());
            formData.append('restaurantName', infoForm.restaurantName.trim());
            formData.append('subtitle', infoForm.subtitle.trim());
            formData.append('foodType', infoForm.foodType);
            formData.append('description', infoForm.description.trim());
            formData.append('rating', String(Number(infoForm.rating) || 0));
            formData.append('location', infoForm.location.trim());
            formData.append('openTime', infoForm.openTime.trim());
            formData.append('closeTime', infoForm.closeTime.trim());
            formData.append('callNumber', infoForm.callNumber.trim());
            formData.append('directionLink', infoForm.directionLink.trim());

            if (logoFile) {
                formData.append('logoFile', logoFile);
            }

            const encodeMenu = (items, prefix) =>
                (items || []).map((item, idx) => {
                    const payload = {
                        name: item.name || '',
                        description: item.description || '',
                        price: Number(item.price) || 0,
                        image: item.image || ''
                    };
                    if (item.file) {
                        const key = `menuImage_${prefix}_${idx}`;
                        formData.append(key, item.file);
                        payload.image = `upload:${key}`;
                    }
                    return payload;
                });

            formData.append('vegMenu', JSON.stringify(encodeMenu(infoForm.menu.vegMenu, 'veg')));
            formData.append('nonVegMenu', JSON.stringify(encodeMenu(infoForm.menu.nonVegMenu, 'nonVeg')));
            formData.append('cafeMenu', JSON.stringify(encodeMenu(infoForm.menu.cafeMenu, 'cafe')));

            formData.append('photos', JSON.stringify(infoForm.photos || []));
            formData.append('videos', JSON.stringify(infoForm.videos || []));

            photoFiles.forEach((file) => formData.append('photoFiles', file));
            videoFiles.forEach((file) => formData.append('videoFiles', file));

            await axios.put(`${API_BASE_URL}/api/admin/partner-info/${partnerInfo.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('PartnersInfo saved');
            await fetchPartnerInfoForm(partnerInfo.id, partnerInfo);
            setLogoFile(null);
            setPhotoFiles([]);
            setVideoFiles([]);
            setIsEditingInfo(false);
        } catch (error) {
            alert(error?.response?.data?.message || 'Error saving PartnersInfo');
        } finally {
            setSavingInfo(false);
        }
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
    const getRevenueChangeFromYesterday = () => {
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
    };

    const revenueChange = getRevenueChangeFromYesterday();
    const revenueChangePrefix = revenueChange > 0 ? '+' : '';
    const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

    return (
        <div className="partner-container">
            <div className="top-partner-strip">
                <div className="top-partner-meta">
                    <div className="top-partner-head">
                        <span className="name-icon"><BadgeCheck size={20} /></span>
                        <h4 className="m-0">{infoForm.restaurantName || partnerInfo.name}</h4>
                    </div>
                    <div className="badges">
                        <span className="badge hotel">Partner</span>
                        <span className="badge active">Active</span>
                    </div>
                    <p className="top-partner-msg">Manage approvals faster and keep your customer experience smooth.</p>
                </div>
                <div className="top-strip-actions">
                    <button type="button" className="top-edit-btn" onClick={() => setIsEditingInfo((v) => !v)}>
                        <Pencil size={14} />
                        {isEditingInfo ? 'Close' : 'Edit'}
                    </button>
                    <div className="top-action-icons">
                        <button className="action-icon-btn refresh-btn" onClick={() => { fetchData(partnerInfo.id); fetchPendingBills(partnerInfo.id); }} title="Refresh">
                            <RefreshCw size={18} />
                        </button>
                        <button className="action-icon-btn logout-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`status-band ${isOpen ? 'bg-green' : 'bg-red'}`}>
                <div className="status-info">
                    <div className="power-icon"><Power size={18} /></div>
                    <div>
                        <strong>Business Status: {isOpen ? 'OPEN' : 'CLOSED'}</strong>
                        <p>{isOpen ? 'You are currently accepting discount redemptions' : 'You are currently not accepting redemptions'}</p>
                    </div>
                </div>
                <div className="toggle-container">
                    <span className="status-chip">
                        {isOpen ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {isOpen ? 'Open' : 'Closed'}
                    </span>
                    <label className="switch">
                        <input type="checkbox" checked={isOpen} onChange={toggleBusinessStatus} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="partner-card pending-under-status">
                <div className="card-header">
                    <h4 className="recent-heading">Pending Approval Requests</h4>
                    <span className="pending-count">{pendingBills.length}</span>
                </div>
                <div className="transaction-list">
                    {pendingBills.length > 0 ? (
                        pendingBills.map((bill) => (
                            <div key={bill._id} className="transaction-item pending-item pending-detail-item">
                                <div className="pending-left">
                                    <div className="user-avatar">{bill.userName ? bill.userName[0] : 'U'}</div>
                                    <div className="user-details">
                                        <strong className="pending-title">{bill.userName || 'Customer'}</strong>
                                        <small className="pending-meta">{new Date(bill.createdAt).toLocaleString()}</small>
                                    </div>
                                </div>
                                <div className="pending-center">
                                    <div className="pending-line pending-stat-card">
                                        <span>Bill Amount</span>
                                        <strong className="pending-amount">{formatCurrency(bill.billAmount)}</strong>
                                    </div>
                                    <div className="pending-line pending-stat-card">
                                        <span>Discount</span>
                                        <strong className="pending-discount">- {formatCurrency(bill.discountAmount)}</strong>
                                    </div>
                                    <div className="pending-line pending-stat-card">
                                        <span>Final Amount</span>
                                        <strong className="pending-final">{formatCurrency((Number(bill.billAmount) || 0) - (Number(bill.discountAmount) || 0))}</strong>
                                    </div>
                                </div>
                                <div className="pending-right">
                                    <button
                                        type="button"
                                        className="pending-preview-btn"
                                        onClick={() => bill.billImage && window.open(bill.billImage, '_blank', 'noopener,noreferrer')}
                                        disabled={!bill.billImage}
                                    >
                                        <span className="preview-icon-wrap">
                                            <Eye size={14} />
                                        </span>
                                        Bill Preview
                                        <ExternalLink size={13} />
                                    </button>
                                    <div className="approval-actions">
                                        <button type="button" className="approve-btn" onClick={() => reviewPendingBill(bill._id, 'approve')}>
                                            <CheckCircle2 size={14} /> Approve
                                        </button>
                                        <button type="button" className="reject-btn" onClick={() => reviewPendingBill(bill._id, 'reject')}>
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No pending approvals.</p>
                    )}
                </div>
            </div>

            {isEditingInfo ? (
                <div className="partner-card profile-card">
                    <div className="profile-info">
                        <div className="profile-editor">
                            <div className="pi-edit-wrap">
                                <div className="pi-grid">
                                    <div><label>Email</label><input className="pi-input" value={infoForm.email} onChange={(e) => setField('email', e.target.value)} /></div>
                                    <div><label>Member since</label><input className="pi-input" value={infoForm.memberSince} onChange={(e) => setField('memberSince', e.target.value)} /></div>
                                    <div><label>Restaurant Name</label><input className="pi-input" value={infoForm.restaurantName} onChange={(e) => setField('restaurantName', e.target.value)} /></div>
                                    <div><label>Subtitle</label><input className="pi-input" value={infoForm.subtitle} onChange={(e) => setField('subtitle', e.target.value)} /></div>
                                    <div>
                                        <label>Food Type</label>
                                        <select className="pi-input" value={infoForm.foodType} onChange={(e) => setField('foodType', e.target.value)}>
                                            <option value="Veg">Veg</option>
                                            <option value="Non-Veg">Non-Veg</option>
                                            <option value="Both">Both</option>
                                        </select>
                                    </div>
                                    <div><label>Rating</label><input type="number" step="0.1" min="0" max="5" className="pi-input" value={infoForm.rating} onChange={(e) => setField('rating', e.target.value)} /></div>
                                    <div><label>Location</label><input className="pi-input" value={infoForm.location} onChange={(e) => setField('location', e.target.value)} /></div>
                                    <div><label>Open Time</label><input className="pi-input" value={infoForm.openTime} onChange={(e) => setField('openTime', e.target.value)} /></div>
                                    <div><label>Close Time</label><input className="pi-input" value={infoForm.closeTime} onChange={(e) => setField('closeTime', e.target.value)} /></div>
                                    <div><label>Call Number</label><input className="pi-input" value={infoForm.callNumber} onChange={(e) => setField('callNumber', e.target.value)} /></div>
                                    <div><label>Direction Link</label><input className="pi-input" value={infoForm.directionLink} onChange={(e) => setField('directionLink', e.target.value)} /></div>
                                </div>

                                <label>Description</label>
                                <textarea className="pi-textarea" rows={3} value={infoForm.description} onChange={(e) => setField('description', e.target.value)} />

                                <div className="upload-row">
                                    <div>
                                        <label>Logo Image Upload</label>
                                        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                                    </div>
                                    <div>
                                        <label>Photos Upload</label>
                                        <input type="file" accept="image/*" multiple onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))} />
                                    </div>
                                    <div>
                                        <label>Videos Upload</label>
                                        <input type="file" accept="video/*" multiple onChange={(e) => setVideoFiles(Array.from(e.target.files || []))} />
                                    </div>
                                </div>

                                <div className="menu-editor">
                                    {['vegMenu', 'nonVegMenu', 'cafeMenu'].map((section) => (
                                        <div key={section} className="menu-section">
                                            <div className="menu-head">
                                                <h4>{section === 'vegMenu' ? 'Veg Menu' : section === 'nonVegMenu' ? 'Non-Veg Menu' : 'Cafe Menu'}</h4>
                                                <button type="button" className="mini-btn" onClick={() => addMenuItem(section)}>+ Add Item</button>
                                            </div>
                                            {(infoForm.menu[section] || []).map((item, idx) => (
                                                <div key={`${section}-${idx}`} className="menu-item-row">
                                                    <input className="pi-input" placeholder="Item name" value={item.name || ''} onChange={(e) => setMenuField(section, idx, 'name', e.target.value)} />
                                                    <input className="pi-input" placeholder="Description" value={item.description || ''} onChange={(e) => setMenuField(section, idx, 'description', e.target.value)} />
                                                    <input type="number" className="pi-input" placeholder="Rate" value={item.price ?? ''} onChange={(e) => setMenuField(section, idx, 'price', e.target.value)} />
                                                    <input className="pi-input" placeholder="Image URL (optional)" value={item.image || ''} onChange={(e) => setMenuField(section, idx, 'image', e.target.value)} />
                                                    <input type="file" accept="image/*" onChange={(e) => setMenuField(section, idx, 'file', e.target.files?.[0] || null)} />
                                                    <button type="button" className="mini-btn danger" onClick={() => removeMenuItem(section, idx)}>Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <button type="button" className="save-info-btn" onClick={handleSavePartnersInfo} disabled={savingInfo}>
                                    {savingInfo ? 'Saving...' : 'Save PartnersInfo'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="stats-grid">
                <div className="stat-card stat-revenue">
                    <div className="stat-header"><span>Total Revenue</span> <span className="stat-icon revenue"><TrendingUp size={18} color="#16a34a" /></span></div>
                    <h2>₹{stats.revenue}</h2>
                    <small className={revenueChange >= 0 ? 'text-green' : ''}>{revenueChangePrefix}{revenueChange.toFixed(1)}% from yesterday</small>
                </div>
                <div className="stat-card stat-discount">
                    <div className="stat-header"><span>Discounts Given</span> <span className="stat-icon discount"><DollarSign size={18} color="#ca8a04" /></span></div>
                    <h2>₹{stats.discounts}</h2>
                    <small>{stats.revenue > 0 ? ((stats.discounts / stats.revenue) * 100).toFixed(1) : 0}% of revenue</small>
                </div>
                <div className="stat-card stat-customers">
                    <div className="stat-header"><span>Customers</span> <span className="stat-icon customers"><Users size={18} color="#2563eb" /></span></div>
                    <h2>{stats.customers}</h2>
                    <small className="text-green">Total transactions</small>
                </div>
                <div className="stat-card stat-avgbill">
                    <div className="stat-header"><span>Avg. Bill</span> <span className="stat-icon avgbill"><FileText size={18} color="#7c3aed" /></span></div>
                    <h2>₹{stats.avgBill}</h2>
                    <small>Per transaction</small>
                </div>
            </div>
            <div className="partner-card">
                <div className="card-header">
                    <h4 className="recent-heading">Recent Transactions</h4>
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
                <div className="transaction-list recent-transactions-list">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((t, i) => (
                            <div key={i} className="transaction-item recent-item">
                                <div className="recent-row">
                                    <div className="recent-user-wrap">
                                        <div className="user-avatar">{t.userName ? t.userName[0] : 'U'}</div>
                                        <div className="user-details">
                                            <strong className="recent-title">{t.userName || 'Customer'}</strong>
                                            <small className="recent-sub">{new Date(t.createdAt).toLocaleString()}</small>
                                        </div>
                                    </div>
                                    <span className={`recent-status ${String(t.status || '').toLowerCase() === 'verified' ? 'ok' : ''}`}>{t.status || 'Verified'}</span>

                                    <div className="recent-inline-metric">
                                        <span>Original</span>
                                        <strong>{formatCurrency(t.billAmount)}</strong>
                                    </div>
                                    <div className="recent-inline-metric">
                                        <span>Discount</span>
                                        <strong className="recent-discount">- {formatCurrency(t.discountAmount)}</strong>
                                    </div>
                                    <div className="recent-inline-metric">
                                        <span>Final Pay</span>
                                        <strong className="recent-final">{formatCurrency((Number(t.billAmount) || 0) - (Number(t.discountAmount) || 0))}</strong>
                                    </div>
                                    <div className="recent-inline-metric txid">
                                        <span>Transaction</span>
                                        <strong>{String(t._id || '').slice(-10)}</strong>
                                    </div>
                                    <button
                                        type="button"
                                        className="recent-bill-btn"
                                        onClick={() => t.billImage && window.open(t.billImage, '_blank', 'noopener,noreferrer')}
                                        disabled={!t.billImage}
                                    >
                                        Bill
                                    </button>
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




