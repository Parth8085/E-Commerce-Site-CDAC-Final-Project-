import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const [orderData, setOrderData] = useState(location.state?.orderData || null);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                >
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                top: -20,
                                left: `${Math.random() * 100}%`,
                                opacity: 1,
                                rotate: 0
                            }}
                            animate={{
                                top: '100vh',
                                rotate: 360,
                                opacity: 0
                            }}
                            transition={{
                                duration: 2 + Math.random() * 3,
                                ease: 'linear',
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                            style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                background: ['#7C3AED', '#F43F5E', '#F59E0B', '#10B981'][Math.floor(Math.random() * 4)],
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ position: 'relative', zIndex: 1 }}
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                    style={{ marginBottom: '2rem', display: 'inline-block', position: 'relative' }}
                >
                    <div style={{ position: 'relative' }}>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(16, 185, 129, 0.2)',
                                borderRadius: '50%',
                                zIndex: -1
                            }}
                        />
                        <CheckCircle
                            size={100}
                            color="#10B981"
                            fill="white"
                            style={{
                                filter: 'drop-shadow(0 10px 20px rgba(16, 185, 129, 0.4))'
                            }}
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            style={{ position: 'absolute', top: -10, right: -10 }}
                        >
                            <Sparkles size={32} color="#F59E0B" fill="#F59E0B" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #10B981, #3B82F6)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-1px'
                    }}
                >
                    Order Successful!
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '3rem' }}
                >
                    Thank you {orderData?.customerName ? <strong>{orderData.customerName}</strong> : ''}, your order has been confirmed.
                </motion.p>

                {orderData && (
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="product-card"
                        style={{
                            padding: '0',
                            marginBottom: '3rem',
                            textAlign: 'left',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>{orderData.orderNumber}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Paid</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>₹{orderData.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '0.875rem', fontWeight: 600 }}>
                                    Payment Verified
                                </span>
                                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontSize: '0.875rem', fontWeight: 600 }}>
                                    Processing
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MapPin size={20} color="#4B5563" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Shipping To</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
                                        {orderData.shippingAddress},<br />
                                        {orderData.shippingCity}, {orderData.shippingZipCode}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Truck size={20} color="#4B5563" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Estimated Delivery</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        {orderData.expectedDeliveryDate ? new Date(orderData.expectedDeliveryDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending Confirmation'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
                >
                    <Link to="/my-orders">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary"
                            style={{ padding: '1rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            Track Order <ArrowRight size={18} />
                        </motion.button>
                    </Link>
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1rem', boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)' }}
                        >
                            Continue Shopping
                        </motion.button>
                    </Link>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default OrderSuccess;
