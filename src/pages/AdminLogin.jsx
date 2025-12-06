import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminLogin.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Form */}
            <motion.div
                className="login-left"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="login-form-wrapper">
                    <div>
                        <h1 className="login-title">Sign in</h1>
                        <p className="login-subtitle">Secure Admin Access Portal</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="input-group">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <FaEnvelope className="input-icon" />
                        </div>

                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className="input-icon" />
                            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                        <motion.button
                            type="submit"
                            className="login-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Sign in
                        </motion.button>
                    </form>


                </div>
            </motion.div>

            {/* Right Side - Visual */}
            <div className="login-right">
                <div className="security-visual">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                    <div className="ring ring-3"></div>
                    <FaLock className="lock-icon" />

                    {/* Floating Particles */}
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                width: Math.random() * 5 + 'px',
                                height: Math.random() * 5 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
