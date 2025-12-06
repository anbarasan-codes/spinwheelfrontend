import React from 'react';
import { motion } from 'framer-motion';

const variants = {
    primary: '#2ecc71', // Green (Add/Create)
    secondary: '#3498db', // Blue (Edit)
    danger: '#e74c3c', // Red (Delete)
    info: '#9b59b6', // Purple (View)
    search: '#34495e', // Dark Blue (Search)
    success: '#27ae60', // Dark Green (Download/Export)
    warning: '#f39c12', // Orange (Logout)
    default: '#95a5a6' // Gray
};

const Button = ({ children, onClick, variant = 'default', icon: Icon, style, disabled }) => {
    const bgColor = variants[variant] || variants.default;

    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: bgColor,
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                opacity: disabled ? 0.7 : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                ...style
            }}
        >
            {Icon && <Icon size={18} />}
            <span className="button-text">{children}</span>
            <style>{`
                @media (max-width: 768px) {
                    .button-text {
                        display: none;
                    }
                }
            `}</style>
        </motion.button>
    );
};

export default Button;
