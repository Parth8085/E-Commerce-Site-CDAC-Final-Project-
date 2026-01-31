import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Sparkles } from 'lucide-react';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const [orderData, setOrderData] = useState(location.state?.orderData || null);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            {/* Confetti Animation */}
            {showConfetti && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}>
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                left: `${Math.random() * 100}%`,
                                width: '10px',
                                height: '10px',
                                background: ['#7C3AED', '#F43F5E', '#F59E0B', '#10B981'][Math.floor(Math.random() * 4)],
                                opacity: 0.8,
                                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                                animationDelay: `${Math.random() * 0.5}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Success Icon with Animation */}
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{
                    display: 'inline-block',
                    position: 'relative',
                    animation: 'scaleIn 0.5s ease-out'
                }}>
                    <CheckCircle
                        size={100}
                        color="#10B981"
                        style={{
                            margin: '0 auto',
                            filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3))'
                        }}
                    />
                    <Sparkles
                        size={24}
                        color="#F59E0B"
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                🎉 Order Placed Successfully!
            </h1>

            {orderData ? (
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
                    Thank you for your purchase, <span style={{ fontWeight: 600, color: 'var(--text)' }}>{orderData.customerName || 'Customer'}</span>! Your order has been confirmed.
                </p>
            ) : (
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
                    Thank you for your purchase. Your order has been confirmed.
                </p>
            )}

            {orderData && (
                <div className="product-card" style={{
                    padding: '2rem',
                    marginBottom: '2rem',
                    textAlign: 'left',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    border: '2px solid rgba(16, 185, 129, 0.2)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Order Number</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{orderData.orderNumber}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Amount</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>₹{orderData.totalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Payment Status</p>
                            <p style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: orderData.paymentStatus === 'Success' ? '#10B981' : 'orange',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {orderData.paymentStatus === 'Success' && '✓'} {orderData.paymentStatus}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Expected Delivery</p>
                            <p style={{ fontSize: '1rem', fontWeight: 600 }}>
                                {orderData.expectedDeliveryDate ? new Date(orderData.expectedDeliveryDate).toLocaleDateString() : 'TBD'}
                            </p>
                        </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            <strong>Transaction ID:</strong> {orderData.transactionId}
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <Package size={24} color="#10B981" />
                        <p style={{ color: '#059669', fontWeight: 500 }}>
                            📧 We'll send you shipping confirmation when your item(s) are on the way!
                        </p>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <Link to="/my-orders">
                    <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                        📦 View My Orders
                    </button>
                </Link>
                <Link to="/">
                    <button className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>
                        🛍️ Continue Shopping
                    </button>
                </Link>
            </div>

            {/* What's Next Section */}
            <div style={{ marginTop: '3rem', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>What happens next?</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {[
                        { icon: Package, title: 'Order Processing', desc: 'We are preparing your items for shipment', color: '#7C3AED' },
                        { icon: Truck, title: 'Shipping', desc: 'Your order will be shipped within 1-2 business days', color: '#F59E0B' },
                        { icon: MapPin, title: 'Delivery', desc: 'Track your package and receive it at your doorstep', color: '#10B981' }
                    ].map((step, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1.5rem',
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            transition: 'all 0.3s',
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(8px)';
                                e.currentTarget.style.borderColor = step.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${step.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <step.icon size={24} color={step.color} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{step.title}</h4>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;
