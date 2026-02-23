import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, QrCode, CreditCard, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import './Signup.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://magicpoint.onrender.com';

function Signup() {
    const navigate = useNavigate();
    const [activePlan, setActivePlan] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', email: '', mobile: '', password: '', confirmPassword: '' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setStatusMessage('');

        if (!activePlan) {
            setErrorMessage('Please select a membership plan first.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Password and confirm password do not match.');
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                mobile: formData.mobile.trim(),
                password: formData.password,
                membershipPlan: activePlan === 'single' ? 'Single Plan' : 'Family Plan'
            };

            const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, payload);
            const message = response?.data?.message || 'Signup successful';
            setStatusMessage(`${message}. Please login now.`);

            localStorage.setItem('pendingSignupMobile', payload.mobile);
            navigate('/login', { state: { mobile: payload.mobile } });
        } catch (error) {
            const message = error?.response?.data?.message ||
                (error?.request
                    ? `Unable to reach server (${API_BASE_URL}). Check Render deployment, CORS_ORIGINS, and VITE_API_BASE_URL.`
                    : 'Signup failed. Please try again.');
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper signup-scope">
            <div className="auth-card signup-card">

                {/* Back Button */}
                <button className="back-btn" onClick={handleBack}>← Back</button>

                <div className="auth-header">
                    <div className="brand-logo">
                        Magic<span>Point</span>
                    </div>
                    <h2>Exclusive Membership</h2>
                    <p>Select a plan to unlock 500+ partner discounts</p>
                </div>

                {/* Plans Section (Same as before — untouched) */}
                <div className="plans-display-container">

                    {/* Single Plan */}
                    <div className={`premium-plan-card ${activePlan === 'single' ? 'selected-single' : ''}`}>
                        <div className="plan-badge-top">Popular</div>
                        <div className="plan-visual single-bg">
                            <User size={30} />
                        </div>
                        <h3>Single Plan</h3>
                        <div className="plan-cost">₹50<span>/2 day</span></div>

                        <ul className="plan-features">
                            <li><CheckCircle2 size={16}/> 10% discount at 500+ partners</li>
                            <li><CheckCircle2 size={16}/> Valid for 2 Days (48 Hours)</li>
                            <li><CheckCircle2 size={16}/> Unlimited redemptions</li>
                            <li><CheckCircle2 size={16}/> Secure OTP verification</li>
                            <li><CheckCircle2 size={16}/> Single user access</li>
                        </ul>

                        <button className="select-plan-btn blue-btn" onClick={() => setActivePlan('single')}>
                            {activePlan === 'single' ? 'Selected' : 'Select Single Plan'} 
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Family Plan */}
                    <div className={`premium-plan-card ${activePlan === 'family' ? 'selected-family' : ''}`}>
                        <div className="plan-badge-top green-badge">Best Value</div>
                        <div className="plan-visual family-bg">
                            <Users size={30} />
                        </div>
                        <h3>Family Plan</h3>
                        <div className="plan-cost">₹99<span>/2 day</span></div>

                        <ul className="plan-features">
                            <li><CheckCircle2 size={16}/> 10% discount at 500+ partners</li>
                            <li><CheckCircle2 size={16}/> Valid for 2 Days (48 Hours)</li>
                            <li><CheckCircle2 size={16}/> Unlimited redemptions</li>
                            <li><CheckCircle2 size={16}/> Secure OTP verification</li>
                            <li><CheckCircle2 size={16}/> Up to 4 family members</li>
                            <li><CheckCircle2 size={16}/> Shared discount history</li>
                        </ul>

                        <button className="select-plan-btn green-btn" onClick={() => setActivePlan('family')}>
                            {activePlan === 'family' ? 'Selected' : 'Select Family Plan'} 
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Registration Form */}
                {activePlan && (
                    <div className="registration-section-fade-in">
                        <div className="section-divider">
                            <span>Register for {activePlan === 'single' ? 'Single' : 'Family'} Membership</span>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>

                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input type="text" name="name" placeholder="Full Name" required onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <Mail className="input-icon" size={20} />
                                <input type="email" name="email" placeholder="Email Address" required onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <Phone className="input-icon" size={20} />
                                <input type="number" name="mobile" placeholder="Mobile Number" required onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <Lock className="input-icon" size={20} />
                                <input type="password" name="password" placeholder="Create Password" required onChange={handleChange}/>
                            </div>

                            {/* Confirm Password Added */}
                            <div className="input-group">
                                <Lock className="input-icon" size={20} />
                                <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange}/>
                            </div>

                            {/* Payment Box */}
                            <div className={`payment-info-box ${activePlan === 'single' ? 'blue-soft' : 'green-soft'}`}>
                                <p className="pay-tag">Secure UPI Payment</p>
                                <div className="qr-wrapper">
                                    <QrCode size={120} color={activePlan === 'single' ? '#3b82f6' : '#22c55e'} />
                                    <p className="pay-amount">Pay ₹{activePlan === 'single' ? '50' : '99'}</p>
                                </div>
                                <div className="payment-icons">
                                    <CreditCard size={18}/> Trusted Payment Gateways
                                </div>
                            </div>

                            {errorMessage && <p style={{ color: '#dc2626', marginTop: '10px' }}>{errorMessage}</p>}
                            {statusMessage && <p style={{ color: '#059669', marginTop: '10px' }}>{statusMessage}</p>}

                            <button
                                type="submit"
                                className={`final-submit-btn ${activePlan === 'single' ? 'bg-blue' : 'bg-green'}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Complete Registration & Pay'}
                            </button>
                        </form>
                    </div>
                )}

                <p className="auth-footer">
                    Already a member? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
