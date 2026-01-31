import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    LayoutDashboard, ShoppingBag, Users, Package, TrendingUp,
    Clock, Truck, CheckCircle, XCircle, Edit, Search
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'Admin') {
            navigate('/admin/login');
            return;
        }
        fetchDashboardData();
    }, [user, navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, usersRes, productsRes] = await Promise.all([
                api.get('/admin/dashboard/stats'),
                api.get('/admin/orders'),
                api.get('/admin/users'),
                api.get('/admin/products')
            ]);
            setStats(statsRes.data);
            setOrders(ordersRes.data.orders);
            setUsers(usersRes.data.users);
            setProducts(productsRes.data.products);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status });
            alert('Order status updated successfully!');
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const handleUpdateStock = async (productId, stock) => {
        try {
            await api.put(`/admin/products/${productId}/stock`, { stock });
            alert('Stock updated successfully!');
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading admin dashboard...</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                padding: '2rem 1rem',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 700 }}>
                    Admin Panel
                </h2>

                <nav>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'orders', label: 'Orders', icon: ShoppingBag },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'products', label: 'Products', icon: Package }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                marginBottom: '0.5rem',
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: 'none',
                                borderLeft: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                                color: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '1rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.7 }}>Logged in as:</p>
                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{user?.name}</p>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Dashboard Overview</h1>

                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            {[
                                { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#10b981' },
                                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#3b82f6' },
                                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#8b5cf6' },
                                { label: 'Total Products', value: stats.totalProducts, icon: Package, color: '#f59e0b' }
                            ].map((stat, idx) => (
                                <div key={idx} className="product-card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <div>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.value}</p>
                                        </div>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: `${stat.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <stat.icon size={24} color={stat.color} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Status Cards */}
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Order Status</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                            {[
                                { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: '#f59e0b' },
                                { label: 'Processing', value: stats.processingOrders, icon: Package, color: '#3b82f6' },
                                { label: 'Shipped', value: stats.shippedOrders, icon: Truck, color: '#8b5cf6' },
                                { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: '#10b981' }
                            ].map((status, idx) => (
                                <div key={idx} className="product-card" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <status.icon size={32} color={status.color} style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{status.value}</p>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{status.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Orders */}
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Orders</h3>
                        <div className="product-card" style={{ padding: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Order #</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>{order.orderNumber}</td>
                                            <td style={{ padding: '1rem' }}>{order.customerName}</td>
                                            <td style={{ padding: '1rem' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>₹{order.totalAmount.toLocaleString()}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    background: order.status === 'Delivered' ? '#10b98120' : order.status === 'Shipped' ? '#3b82f620' : '#f59e0b20',
                                                    color: order.status === 'Delivered' ? '#10b981' : order.status === 'Shipped' ? '#3b82f6' : '#f59e0b'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Manage Orders</h1>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {orders
                                .filter(order => !statusFilter || order.status === statusFilter)
                                .map(order => (
                                    <div key={order.id} className="product-card" style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                                    {order.orderNumber}
                                                </h3>
                                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                                    {order.customerName} ({order.customerEmail})
                                                </p>
                                                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                                    {new Date(order.orderDate).toLocaleString()}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                    {order.itemCount} items
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                                            <label style={{ fontWeight: 500 }}>Update Status:</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border)',
                                                    flex: 1,
                                                    maxWidth: '200px'
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Delayed">Delayed</option>
                                            </select>
                                            {order.trackingNumber && (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                    Tracking: {order.trackingNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Manage Users</h1>

                        <div className="product-card" style={{ padding: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Role</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Orders</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Total Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>{user.name}</td>
                                            <td style={{ padding: '1rem' }}>{user.email}</td>
                                            <td style={{ padding: '1rem' }}>{user.phoneNumber}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    background: user.role === 'Admin' ? '#ef444420' : '#3b82f620',
                                                    color: user.role === 'Admin' ? '#ef4444' : '#3b82f6'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>{user.totalOrders}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                                                ₹{user.totalSpent.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Manage Products</h1>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {products.map(product => (
                                <div key={product.id} className="product-card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {product.name}
                                            </h3>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                                {product.brand} • {product.category}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Price</p>
                                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                ₹{product.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Stock</p>
                                            <input
                                                type="number"
                                                value={product.stock}
                                                onChange={(e) => {
                                                    const newStock = parseInt(e.target.value);
                                                    if (!isNaN(newStock) && newStock >= 0) {
                                                        handleUpdateStock(product.id, newStock);
                                                    }
                                                }}
                                                style={{
                                                    width: '80px',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid var(--border)',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                background: product.stock > 10 ? '#10b98120' : product.stock > 0 ? '#f59e0b20' : '#ef444420',
                                                color: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444'
                                            }}>
                                                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
