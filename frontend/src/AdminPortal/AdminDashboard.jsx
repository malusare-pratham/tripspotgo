import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2>MagicPoint Admin</h2>
                <button className="active">Dashboard</button>
                <button onClick={() => { localStorage.clear(); window.location.href = '/admin-login'; }} className="logout-btn">
                    Logout
                </button>
            </aside>

            <main className="content">
                <div className="partner-list-view">
                    <h3>Admin Dashboard</h3>
                    <p>Dashboard data is currently unavailable.</p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
