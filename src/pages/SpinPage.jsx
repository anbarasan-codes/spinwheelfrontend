import { useState, useEffect } from 'react';
import api from '../api';
import SpinWheel from '../components/SpinWheel';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserCog } from 'react-icons/fa';

function SpinPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [prizes, setPrizes] = useState([]);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [spinResult, setSpinResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/prizes')
            .then(res => {
                const activePrizes = res.data.filter(p => p.is_active);
                setPrizes(activePrizes);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSpinClick = async (e) => {
        e.preventDefault();
        if (mustSpin) return;
        setError('');
        setSpinResult(null);

        if (!name) {
            setError('Please enter your name');
            return;
        }

        try {
            const response = await api.post('/spin', { name, email });
            const result = response.data;
            const prizeIndex = prizes.findIndex(p => p.name === result.prize_name);

            if (prizeIndex !== -1) {
                setPrizeNumber(prizeIndex);
                setMustSpin(true);
                setSpinResult(result);
            } else {
                setError('Prize mismatch error. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    const handleStopSpinning = () => {
        setMustSpin(false);
        if (spinResult && spinResult.prize_name !== "No Prize") {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const random = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at center, #1a2a6c, #b21f1f, #fdbb2d)', // Fallback
            background: 'radial-gradient(circle at 50% 30%, #2b32b2, #141e30)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Montserrat', sans-serif",
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Admin Link */}
            <Link to="/admin/login" style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '1.5rem',
                zIndex: 100,
                transition: 'color 0.3s',
                cursor: 'pointer'
            }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
                title="Admin Login"
            >
                <FaUserCog />
            </Link>

            {/* Bokeh Background Effect */}
            <div className="bokeh-container">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="bokeh-circle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5
                    }} />
                ))}
            </div>

            {/* Spotlight Effect */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            {/* Main Title */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                style={{
                    fontSize: '4rem',
                    margin: '20px 0',
                    textAlign: 'center',
                    color: '#ffd700',
                    textTransform: 'uppercase',
                    letterSpacing: '5px',
                    textShadow: '0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de',
                    zIndex: 10,
                    fontWeight: '900'
                }}
            >
                JACKPOT
            </motion.h1>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                width: '100%',
                maxWidth: '2000px',
                zIndex: 10,
                padding: '20px'
            }}>
                {/* Wheel Section */}
                <div style={{ position: 'relative' }}>
                    {loading ? <p>Loading Wheel...</p> : (
                        prizes.length > 0 ? (
                            <SpinWheel
                                prizes={prizes}
                                mustSpin={mustSpin}
                                prizeNumber={prizeNumber}
                                onStopSpinning={handleStopSpinning}
                            />
                        ) : <p>No prizes available currently.</p>
                    )}
                </div>

                {/* Controls Section */}
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    {!spinResult ? (
                        <form onSubmit={handleSpinClick} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                            <input
                                type="text"
                                placeholder="ENTER YOUR NAME"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={mustSpin}
                                style={{
                                    padding: '15px',
                                    borderRadius: '30px',
                                    border: '2px solid #00d2ff',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    fontSize: '18px',
                                    textAlign: 'center',
                                    outline: 'none',
                                    boxShadow: '0 0 10px #00d2ff'
                                }}
                            />
                            <motion.button
                                type="submit"
                                disabled={mustSpin}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ boxShadow: ["0 0 10px #ff9900", "0 0 20px #ff9900", "0 0 10px #ff9900"] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    padding: '20px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: 'linear-gradient(to bottom, #ff9900, #ff0000)',
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    cursor: mustSpin ? 'not-allowed' : 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    width: '100%'
                                }}
                            >
                                {mustSpin ? 'SPINNING...' : 'SPIN NOW'}
                            </motion.button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            <h2 style={{ fontSize: '2.5rem', color: '#ffd700', textShadow: '0 0 10px #ffd700' }}>
                                {spinResult.prize_name === "No Prize" ? "TRY AGAIN!" : "WINNER!"}
                            </h2>
                            <div style={{
                                background: 'linear-gradient(45deg, #ffd700, #fdbb2d)',
                                padding: '20px 40px',
                                borderRadius: '10px',
                                color: '#000',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                margin: '20px 0',
                                boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)'
                            }}>
                                {spinResult.prize_name}
                            </div>
                            <button
                                onClick={() => { setSpinResult(null); setName(''); }}
                                style={{
                                    padding: '10px 30px',
                                    borderRadius: '30px',
                                    border: '2px solid white',
                                    background: 'transparent',
                                    color: 'white',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Spin Again
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: 'auto',
                marginBottom: '20px',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.2rem',
                color: '#00d2ff',
                textShadow: '0 0 5px #00d2ff',
                borderBottom: '2px solid #00d2ff',
                paddingBottom: '5px',
                zIndex: 10
            }}>
                FORTUNE WHEEL
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&family=Orbitron:wght@700&display=swap');
                
                .bokeh-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 0;
                }
                .bokeh-circle {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    animation: float 10s infinite linear;
                }
                @keyframes float {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.2); }
                    100% { transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

export default SpinPage;
