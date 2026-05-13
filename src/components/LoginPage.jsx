import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle, CheckCircle2, Users } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);

    // Request Form State
    const [requestName, setRequestName] = useState('');
    const [requestEmail, setRequestEmail] = useState('');
    const [requestMsg, setRequestMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('email', email);
                setSuccess(true);
                setTimeout(() => {
                    onLoginSuccess();
                }, 1500);
            } else {
                setError(data.detail || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Could not connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAccess = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Access Request: ${requestName} (${requestEmail})`);
        const body = encodeURIComponent(`Admin,\n\nA new user is requesting contribution access:\n\nName: ${requestName}\nEmail: ${requestEmail}\n\nMessage:\n${requestMsg}\n\nRegards,\n${requestName}`);
        
        // Use Gmail direct compose link
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ushasahu2010sahu@gmail.com&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
        
        // Show success message briefly
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="login-container animate-fade-in">
            <div className="login-card">
                {!showRequestForm ? (
                    <>
                        <div className="login-header">
                            <div className="login-icon-box">
                                <Lock size={32} />
                            </div>
                            <h2 className="login-title">Staff Login</h2>
                            <p className="login-subtitle">Access the secure upload system</p>
                        </div>

                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="login-error">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="login-success">
                                    <CheckCircle2 size={18} />
                                    <span>Login successful! Redirecting...</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`login-button ${loading ? 'loading' : ''}`}
                                disabled={loading || success}
                            >
                                {loading ? 'Authenticating...' : (
                                    <>
                                        <LogIn size={18} />
                                        <span>Login</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Don't have access?</p>
                            <button className="request-link" onClick={() => setShowRequestForm(true)}>
                                Request Contribution Access
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="login-header">
                            <div className="login-icon-box" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' }}>
                                <Users size={32} />
                            </div>
                            <h2 className="login-title">Request Access</h2>
                            <p className="login-subtitle">Send a message to the administrator</p>
                        </div>

                        <form className="login-form" onSubmit={handleRequestAccess}>
                            <div className="form-group">
                                <label htmlFor="req-name">Your Name</label>
                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input
                                        id="req-name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={requestName}
                                        onChange={(e) => setRequestName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="req-email">Your Email</label>
                                <div className="input-with-icon">
                                    <LogIn size={18} className="input-icon" style={{ transform: 'rotate(90deg)' }} />
                                    <input
                                        id="req-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={requestEmail}
                                        onChange={(e) => setRequestEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="req-msg">Message</label>
                                <textarea
                                    id="req-msg"
                                    placeholder="Tell us why you want to contribute..."
                                    value={requestMsg}
                                    onChange={(e) => setRequestMsg(e.target.value)}
                                    required
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1.5px solid #eee',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        resize: 'none'
                                    }}
                                />
                            </div>

                            <button type="submit" className="login-button" style={{ background: '#4A90E2' }}>
                                <LogIn size={18} />
                                <span>Send Request</span>
                            </button>
                        </form>

                        <div className="login-footer">
                            <button className="request-link" onClick={() => setShowRequestForm(false)}>
                                Back to Login
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style jsx="true">{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 70vh;
                    padding: 20px;
                }
                .login-card {
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                    padding: 40px;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .login-icon-box {
                    background: linear-gradient(135deg, #F26522 0%, #ff8c52 100%);
                    width: 64px;
                    height: 64px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    color: white;
                    box-shadow: 0 10px 20px rgba(242, 101, 34, 0.3);
                }
                .login-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                }
                .login-subtitle {
                    color: #666;
                    font-size: 14px;
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #444;
                }
                .input-with-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 14px;
                    color: #999;
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 12px 14px 12px 42px;
                    border-radius: 12px;
                    border: 1.5px solid #eee;
                    font-size: 15px;
                    transition: all 0.2s;
                    outline: none;
                }
                .input-with-icon input:focus, #req-msg:focus {
                    border-color: #F26522;
                    box-shadow: 0 0 0 4px rgba(242, 101, 34, 0.1);
                }
                .login-button {
                    background: #1a1a1a;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    margin-top: 10px;
                }
                .login-button:hover:not(:disabled) {
                    filter: brightness(1.1);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .login-button:active:not(:disabled) {
                    transform: translateY(0);
                }
                .login-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .login-error {
                    background: #fff5f5;
                    color: #e53e3e;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #fed7d7;
                }
                .login-success {
                    background: #f0fff4;
                    color: #38a169;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #c6f6d5;
                }
                .login-footer {
                    margin-top: 32px;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }
                .request-link {
                    background: none;
                    border: none;
                    color: #F26522;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 5px;
                    text-decoration: underline;
                }
                .request-link:hover {
                    color: #ff8c52;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
