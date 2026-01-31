import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, Truck, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, authLoading, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/order/my-orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={20} color="green" />;
            case 'Shipped': return <Truck size={20} color="blue" />;
            case 'Processing': return <Package size={20} color="orange" />;
            case 'Cancelled': return <XCircle size={20} color="red" />;
            case 'Delayed': return <AlertTriangle size={20} color="orange" />;
            default: return <Clock size={20} color="gray" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'green';
            case 'Shipped': return 'blue';
            case 'Processing': return 'orange';
            case 'Cancelled': return 'red';
            case 'Delayed': return 'orange';
            default: return 'gray';
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading your orders...</div>;

    return (
        <div className="animate-fade-in">
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>My Orders</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
                    <Package size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h3>
                    <p>Start shopping to see your orders here!</p>
                    <Link to="/">
                        <button className="btn-primary" style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}>
                            Start Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="product-card" style={{ padding: '1.5rem' }}>
                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {order.orderNumber}
                                    </h3>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                        Placed on {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {getStatusIcon(order.status)}
                                        <span style={{ fontWeight: 600, color: getStatusColor(order.status) }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                                        ₹{order.totalAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={{ marginBottom: '1rem' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-light)' }}>
                                        <span>{item.productName} × {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tracking Info */}
                            {order.trackingNumber && (
                                <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <strong>Tracking Number:</strong> {order.trackingNumber}
                                    </p>
                                    {order.shippedDate && (
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                            Shipped on {new Date(order.shippedDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Expected Delivery */}
                            {order.expectedDeliveryDate && !order.deliveredDate && (
                                <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                                        Expected Delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {/* Delivered Date */}
                            {order.deliveredDate && (
                                <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <p style={{ color: 'green', fontWeight: 500, fontSize: '0.9rem' }}>
                                        Delivered on {new Date(order.deliveredDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {/* Shipping Address */}
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                    <strong>Shipping to:</strong> {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                                </p>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                                </button>
                                {order.trackingNumber && (
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '0.5rem' }}
                                    >
                                        Track Order
                                    </button>
                                )}
                            </div>

                            {/* Expanded Details */}
                            {selectedOrder?.id === order.id && (
                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                                    <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Order Timeline</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <CheckCircle size={20} color="green" />
                                            <div>
                                                <p style={{ fontWeight: 500 }}>Order Placed</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                    {new Date(order.orderDate).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        {order.shippedDate && (
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <Truck size={20} color="blue" />
                                                <div>
                                                    <p style={{ fontWeight: 500 }}>Shipped</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                        {new Date(order.shippedDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {order.deliveredDate && (
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <CheckCircle size={20} color="green" />
                                                <div>
                                                    <p style={{ fontWeight: 500 }}>Delivered</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                        {new Date(order.deliveredDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            <strong>Payment Method:</strong> {order.paymentMethod}
                                        </p>
                                        <p style={{ fontSize: '0.9rem' }}>
                                            <strong>Payment Status:</strong> <span style={{ color: order.paymentStatus === 'Success' ? 'green' : 'orange' }}>{order.paymentStatus}</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
