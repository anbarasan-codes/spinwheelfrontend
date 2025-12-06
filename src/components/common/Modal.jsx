import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(5px)'
            }} onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}
                >
                    <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>{title}</h3>
                    <div style={{ marginBottom: '20px', color: '#666' }}>
                        {children}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        {actions}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Modal;
