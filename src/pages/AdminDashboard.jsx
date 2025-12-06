import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Button from '../components/common/Button';
import { FaSync, FaPlus, FaFileAlt, FaDownload, FaPause, FaPlay, FaRedo, FaFlask } from 'react-icons/fa';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [spinPaused, setSpinPaused] = useState(false);

    const fetchStats = () => {
        api.get('/spins/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) return <div style={{ color: 'white' }}>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#f8fafc', fontSize: '2rem' }}>Dashboard Overview</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Button variant="secondary" icon={FaSync} onClick={fetchStats}>Refresh</Button>
                    <Link to="/admin/prizes" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" icon={FaPlus}>Add Prize</Button>
                    </Link>
                    <Button variant="info" icon={FaFileAlt}>Reports</Button>
                    <Button variant="success" icon={FaDownload}>CSV</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                <div className="admin-card">
                    <h3 className="card-title">Total Spins</h3>
                    <p className="card-value">{stats.total_spins}</p>
                </div>

                <div className="admin-card">
                    <h3 className="card-title">Prize Distribution</h3>
                    <ul style={{ paddingLeft: '20px', margin: '10px 0', color: '#94a3b8' }}>
                        {Object.entries(stats.prize_distribution).map(([name, count]) => (
                            <li key={name} style={{ marginBottom: '8px' }}>
                                <strong style={{ color: '#f8fafc' }}>{name}:</strong> {count}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="admin-card">
                    <h3 className="card-title">Top Users</h3>
                    <ul style={{ paddingLeft: '20px', margin: '10px 0', color: '#94a3b8' }}>
                        {Object.entries(stats.top_users).map(([name, count]) => (
                            <li key={name} style={{ marginBottom: '8px' }}>
                                <strong style={{ color: '#f8fafc' }}>{name}:</strong> {count} spins
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Spin Controls */}
            <div className="admin-card">
                <h3 className="card-title" style={{ marginBottom: '25px' }}>System Controls</h3>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <button
                        className="btn-neon"
                        onClick={() => setSpinPaused(!spinPaused)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        {spinPaused ? <FaPlay /> : <FaPause />}
                        {spinPaused ? "Resume System" : "Pause System"}
                    </button>
                    <button className="btn-neon btn-danger-neon" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaRedo /> Reset Data
                    </button>
                    <button className="btn-neon" style={{ borderColor: '#a855f7', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaFlask /> Test Mode
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
