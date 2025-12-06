import { useEffect, useState } from 'react';
import api from '../api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { FaPlus, FaSearch, FaTimes, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

function Prizes() {
    const [prizes, setPrizes] = useState([]);
    const [filteredPrizes, setFilteredPrizes] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', quantity: 0, weight: 0 });
    const [editingId, setEditingId] = useState(null);

    const fetchPrizes = () => {
        api.get('/prizes')
            .then(res => {
                setPrizes(res.data);
                setFilteredPrizes(res.data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPrizes();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFilteredPrizes(prizes.filter(p =>
            p.name.toLowerCase().includes(lowerSearch)
        ));
    }, [search, prizes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/prizes/${editingId}`, form);
            } else {
                await api.post('/prizes', form);
            }
            setForm({ name: '', quantity: 0, weight: 0 });
            setEditingId(null);
            setIsModalOpen(false);
            fetchPrizes();
        } catch (err) {
            alert('Error saving prize');
        }
    };

    const handleEdit = (prize) => {
        setForm({ name: prize.name, quantity: prize.quantity, weight: prize.weight });
        setEditingId(prize.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this prize?')) {
            try {
                await api.delete(`/prizes/${id}`);
                fetchPrizes();
            } catch (err) {
                alert('Error deleting prize');
            }
        }
    };

    const handleToggleActive = async (prize) => {
        try {
            await api.put(`/prizes/${prize.id}`, { ...prize, is_active: !prize.is_active });
            fetchPrizes();
        } catch (err) {
            alert('Error updating status');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>Manage Prizes</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#bdc3c7' }} />
                        <input
                            type="text"
                            placeholder="Search Prize..."
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
                    <Button variant="default" icon={FaTimes} onClick={() => setSearch('')}>Clear</Button>
                    <Button variant="primary" icon={FaPlus} onClick={() => { setEditingId(null); setForm({ name: '', quantity: 0, weight: 0 }); setIsModalOpen(true); }}>Add New Prize</Button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #ecf0f1' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Quantity</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Weight</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#7f8c8d' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'right', color: '#7f8c8d' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPrizes.map(prize => (
                            <tr key={prize.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{prize.name}</td>
                                <td style={{ padding: '15px' }}>{prize.quantity}</td>
                                <td style={{ padding: '15px' }}>{prize.weight}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        background: prize.is_active ? '#e8f8f5' : '#fdedec',
                                        color: prize.is_active ? '#27ae60' : '#c0392b',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        {prize.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                    <Button variant="secondary" icon={FaEdit} onClick={() => handleEdit(prize)} style={{ padding: '8px' }} />
                                    <Button variant="danger" icon={FaTrash} onClick={() => handleDelete(prize.id)} style={{ padding: '8px' }} />
                                    <Button variant="default" icon={prize.is_active ? FaToggleOn : FaToggleOff} onClick={() => handleToggleActive(prize)} style={{ padding: '8px', color: prize.is_active ? '#27ae60' : '#95a5a6' }} />
                                    <Button variant="info" icon={FaEye} style={{ padding: '8px' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Prize' : 'Add New Prize'}
                actions={
                    <>
                        <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit}>Save</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={e => setForm({ ...form, quantity: e.target.value })}
                        required
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="number"
                        placeholder="Weight"
                        value={form.weight}
                        onChange={e => setForm({ ...form, weight: e.target.value })}
                        required
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                </form>
            </Modal>
        </div>
    );
}

export default Prizes;
