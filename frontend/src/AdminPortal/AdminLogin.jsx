import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://magicpoint.onrender.com';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/admin/login`, { email, password });
            
            // टोकन आणि ॲडमिन डेटा सेव्ह करणे
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('isAdmin', 'true');
            
            alert("Login Successful!");
            navigate('/admin/dashboard'); // लॉगिन झाल्यावर इकडे जाईल
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed. Try again.");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>MagicPoint Admin</h2>
                <p>Please enter your credentials</p>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="admin@magicpoint.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="login-btn">Login to Dashboard</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
