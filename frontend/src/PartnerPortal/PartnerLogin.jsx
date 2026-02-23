import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, ArrowRight } from 'lucide-react';
import './PartnerLogin.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const PartnerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // बॅकेंड राऊट: /api/admin/partner-login (हा आपण नंतर बनवू)
            const res = await axios.post(`${API_BASE_URL}/api/admin/partner-login`, { email, password });
            
            localStorage.setItem('partnerToken', res.data.token);
            localStorage.setItem('partnerInfo', JSON.stringify(res.data.partner));
            
            alert("Partner Login Successful!");
            navigate('/partner/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials, please try again.");
        }
    };

    return (
        <div className="partner-login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-circle">
                        <Store size={32} color="#2196f3" />
                    </div>
                    <h2>Partner Portal</h2>
                    <p>Manage your business & track redemptions</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <label><Mail size={16} /> Business Email</label>
                        <input 
                            type="email" 
                            placeholder="hotel@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-field">
                        <label><Lock size={16} /> Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="partner-submit-btn">
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <div className="login-footer">
                    <p>New Partner? <span>Contact Admin to register</span></p>
                </div>
            </div>
        </div>
    );
};

export default PartnerLogin;

