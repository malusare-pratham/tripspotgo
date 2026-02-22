import React, { useState } from 'react';
import { Phone, Lock, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import './ForgotPassword.css';

function ForgotPassword() {
    const [step, setStep] = useState(1); // १: मोबाईल नंबर, २: नवीन पासवर्ड

    return (
        <div className="fgt-page-container">
            <div className="fgt-glass-card">
                <div className="fgt-header-section">
                    <div className="fgt-icon-circle">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="fgt-title">
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p className="fgt-subtitle">
                        {step === 1 
                            ? "Enter your registered mobile number to verify your account." 
                            : "Create a strong new password for your account."}
                    </p>
                </div>

                <form className="fgt-custom-form" onSubmit={(e) => e.preventDefault()}>
                    {step === 1 ? (
                        /* Step 1: Mobile Entry */
                        <div className="fgt-input-group-fade">
                            <div className="fgt-input-wrapper">
                                <Phone className="fgt-field-icon" size={18} />
                                <input 
                                    type="number" 
                                    className="fgt-main-input"
                                    placeholder="Mobile Number" 
                                    required 
                                />
                            </div>
                            <button className="fgt-submit-btn" onClick={() => setStep(2)}>
                                <span>Verify Mobile</span>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    ) : (
                        /* Step 2: New Password */
                        <div className="fgt-input-group-fade">
                            <div className="fgt-input-wrapper">
                                <Lock className="fgt-field-icon" size={18} />
                                <input 
                                    type="password" 
                                    className="fgt-main-input"
                                    placeholder="New Password" 
                                    required 
                                />
                            </div>
                            <div className="fgt-input-wrapper">
                                <Lock className="fgt-field-icon" size={18} />
                                <input 
                                    type="password" 
                                    className="fgt-main-input"
                                    placeholder="Confirm New Password" 
                                    required 
                                />
                            </div>
                            <button className="fgt-submit-btn fgt-reset-btn">
                                <span>Update Password</span>
                            </button>
                        </div>
                    )}
                </form>

                <div className="fgt-footer-area">
                    <a href="/login" className="fgt-back-link">
                        <ArrowLeft size={16} /> Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;