import { useEffect, useState } from 'react';
import api from '../api';
import Button from '../components/common/Button';
import { FaSearch, FaFileExport, FaSync, FaUser, FaBan, FaUnlock, FaRedo } from 'react-icons/fa';

function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');

    const fetchUsers = () => {
        api.get('/users')
            .then(res => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFilteredUsers(users.filter(u =>
            u.name.toLowerCase().includes(lowerSearch) ||
            (u.email && u.email.toLowerCase().includes(lowerSearch))
        ));
    }, [search, users]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>Users</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#bdc3c7' }} />
                        <input
                            type="text"
                            placeholder="Search User..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                padding: '8px 10px 8px 35px',
                                borderRadius: '20px',
                                border: '1px solid #ecf0f1',
                                outline: 'none',
                                background: 'white'
                            }}
                        />
                    </div>
                    <Button variant="secondary" icon={FaSync} onClick={fetchUsers}>Refresh</Button>
                    <Button variant="success" icon={FaFileExport}>Export CSV</Button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #ecf0f1' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Email</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Total Spins</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Last Spin</th>
                            <th style={{ padding: '15px', textAlign: 'right', color: '#7f8c8d' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                                <td style={{ padding: '15px', color: '#7f8c8d' }}>#{user.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{user.name}</td>
                                <td style={{ padding: '15px' }}>{user.email || '-'}</td>
                                <td style={{ padding: '15px' }}>{user.total_spins}</td>
                                <td style={{ padding: '15px' }}>{user.last_spin_time ? new Date(user.last_spin_time).toLocaleString() : '-'}</td>
                                <td style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                    <Button variant="info" icon={FaUser} style={{ padding: '8px' }} />
                                    <Button variant="danger" icon={FaBan} style={{ padding: '8px' }} />
                                    <Button variant="warning" icon={FaRedo} style={{ padding: '8px' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
