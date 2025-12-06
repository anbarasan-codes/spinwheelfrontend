import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaTachometerAlt, FaGift, FaUsers, FaShieldAlt } from 'react-icons/fa';
import ProfileModal from './ProfileModal';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
        }
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
        { path: '/admin/prizes', label: 'Prizes', icon: FaGift },
        { path: '/admin/users', label: 'Users', icon: FaUsers },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <FaShieldAlt size={28} color="#06b6d4" />
                    <h2 className="brand-title">CYBER SPIN</h2>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="btn-neon btn-danger-neon" onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="main-wrapper">
                {/* Top Header */}
                <header className="admin-header">
                    {/* Search Bar */}
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search system..."
                            className="search-input"
                        />
                    </div>

                    <div className="header-actions">
                        <div className="action-icon">
                            <FaBell size={20} />
                            <span className="notification-badge">3</span>
                        </div>
                        <div
                            className="user-profile"
                            onClick={() => setShowProfileModal(true)}
                        >
                            <div className="user-info">
                                <span className="user-name">Admin</span>
                                <span className="user-role">Super Admin</span>
                            </div>
                            <FaUserCircle size={36} color="#06b6d4" />
                        </div>
                        <FaCog size={20} className="action-icon" onClick={() => setShowProfileModal(true)} />
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    {children}
                </main>
            </div>

            <ProfileModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />
        </div>
    );
};

export default AdminLayout;
