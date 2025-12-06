import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../api';

const ProfileModal = ({ show, onHide }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (show) {
            // Ideally fetch current profile, but for now we might rely on stored email or just leave blank
            // Since we didn't store email in localStorage on login previously, we might need to fetch it or update login to store it.
            // For now, let's just allow setting a new one.
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            setSuccess('');
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password && password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const payload = {};
            if (email) payload.email = email;
            if (password) payload.password = password;

            if (Object.keys(payload).length === 0) {
                return;
            }

            await api.put('/auth/profile', payload);
            setSuccess('Profile updated successfully');
            setTimeout(() => {
                onHide();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Admin Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>New Email (Optional)</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter new email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password (Optional)</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileModal;
