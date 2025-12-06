import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SpinWheel = ({ prizes, mustSpin, prizeNumber, onStopSpinning }) => {
    const controls = useAnimation();
    const [rotation, setRotation] = useState(0);

    // Casino Colors
    const colors = ['#FF0000', '#FFD700', '#00FFFF', '#008000', '#FFA500', '#FFFFFF', '#0000FF', '#FF00FF'];

    const numSegments = prizes.length;
    const segmentAngle = 360 / numSegments;
    const wheelSize = 500; // Increased size
    const center = wheelSize / 2;
    const radius = wheelSize / 2 - 25; // Padding for border

    useEffect(() => {
        if (mustSpin) {
            startSpin();
        }
    }, [mustSpin]);

    const startSpin = async () => {
        const newRotation = rotation + 1440 + (360 - (prizeNumber * segmentAngle) - (segmentAngle / 2)); // 4 full spins + target

        await controls.start({
            rotate: newRotation,
            transition: {
                duration: 5, // 2s fast + 3s slow
                ease: [0.2, 0.8, 0.2, 1], // Custom cubic bezier for "fast then slow"
                type: "tween"
            }
        });

        // Bounce effect at the end
        await controls.start({
            rotate: newRotation - 10,
            transition: { duration: 0.3, ease: "easeInOut" }
        });
        await controls.start({
            rotate: newRotation,
            transition: { duration: 0.3, ease: "easeOut" }
        });

        setRotation(newRotation);
        onStopSpinning();
    };

    const getSegmentPath = (index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;

        // Convert degrees to radians
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '800px', aspectRatio: '1/1' }}>
            {/* LED Border */}
            <div style={{
                position: 'absolute',
                top: '-3%',
                left: '-3%',
                width: '106%',
                height: '106%',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #111, #333, #111)',
                boxShadow: '0 0 20px #00d2ff',
                zIndex: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Blinking Bulbs */}
                {[...Array(24)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: '2.5%',
                        height: '2.5%',
                        background: i % 2 === 0 ? '#00d2ff' : '#fff',
                        borderRadius: '50%',
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 15}deg) translate(53%, -50%)`, // Adjusted translate for responsiveness
                        boxShadow: '0 0 5px #fff',
                        animation: 'blink 1s infinite alternate'
                    }} />
                ))}
            </div>

            {/* The Wheel */}
            <motion.div
                animate={controls}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
                }}
            >
                <svg viewBox={`0 0 ${wheelSize} ${wheelSize}`} style={{ width: '100%', height: '100%' }}>
                    {prizes.map((prize, index) => (
                        <g key={prize.id}>
                            <path
                                d={getSegmentPath(index)}
                                fill={colors[index % colors.length]}
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <text
                                x={center}
                                y={center}
                                fill={['#FFFFFF', '#FFFF00'].includes(colors[index % colors.length]) ? '#000' : '#fff'}
                                fontSize="24"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${index * segmentAngle + segmentAngle / 2}, ${center}, ${center}) translate(0, -${radius / 1.5})`}
                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                            >
                                {prize.name}
                            </text>
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Center Hub */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12%',
                height: '12%',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b)',
                zIndex: 2,
                boxShadow: '0 0 10px rgba(0,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid #fff'
            }}>
                <div style={{ fontSize: '2vw' }}>⭐</div>
            </div>

            {/* Pointer */}
            <div style={{
                position: 'absolute',
                top: '-5%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '4% solid transparent',
                borderRight: '4% solid transparent',
                borderTop: '8% solid #ffd700',
                zIndex: 3,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} />

            <style>{`
                @keyframes blink {
                    0% { opacity: 0.5; transform: rotate(var(--r)) translate(var(--tx), -50%) scale(0.8); }
                    100% { opacity: 1; transform: rotate(var(--r)) translate(var(--tx), -50%) scale(1.2); }
                }
            `}</style>
        </div>
    );
};


export default SpinWheel;
