import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated, authLoading, navigate]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await api.get('/wishlist');
            setWishlist(response.data);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            // Ensure productId is an integer and handle potential malformed IDs
            const id = typeof productId === 'object' ? productId.productId : productId;
            const finalId = parseInt(String(id).split('/')[0]);

            await api.delete(`/wishlist/remove/${finalId}`);
            // Update local state immediately for real-time feel
            setWishlist(prev => ({
                ...prev,
                items: prev.items.filter(item => item.productId !== productId)
            }));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            // Don't alert if it's a 404 (already removed)
            if (error.response && error.response.status !== 404) {
                alert('Failed to remove item from wishlist');
            }
        }
    };

    const handleAddToCart = async (item) => {
        try {
            await addToCart(item.productId, 1);

            // Remove from wishlist after successfully adding to cart
            await handleRemoveFromWishlist(item.productId);

            alert(`${item.productName} added to cart and removed from wishlist!`);
        } catch (error) {
            console.error('Failed to add to cart:', error);

            // Check if it's an out-of-stock error
            if (error.response?.data?.outOfStock) {
                const email = prompt('This product is out of stock. Enter your email to get notified when it\'s back in stock:');
                if (email) {
                    try {
                        await api.post('/stocknotification/request', {
                            email: email,
                            productId: item.productId
                        });
                        alert('Thank you! We will notify you when this product is back in stock.');
                    } catch (notifError) {
                        console.error('Failed to register notification:', notifError);
                        alert(notifError.response?.data?.message || 'Failed to register for notification');
                    }
                }
            } else {
                alert(error.response?.data?.message || 'Failed to add to cart');
            }
        }
    };

    const handleClearWishlist = async () => {
        if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        try {
            await api.delete('/wishlist/clear');
            setWishlist(prev => ({ ...prev, items: [] }));
        } catch (error) {
            console.error('Failed to clear wishlist:', error);
            alert('Failed to clear wishlist');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading your wishlist...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <Heart size={32} color="#F43F5E" fill="#F43F5E" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        My Wishlist
                    </h2>
                    <p style={{ color: 'var(--text-light)' }}>
                        {wishlist?.items?.length || 0} {wishlist?.items?.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
                {wishlist?.items?.length > 0 && (
                    <button
                        onClick={handleClearWishlist}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #F43F5E',
                            background: 'white',
                            color: '#F43F5E',
                            cursor: 'pointer',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F43F5E';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#F43F5E';
                        }}
                    >
                        <Trash2 size={18} />
                        Clear All
                    </button>
                )}
            </div>

            {!wishlist?.items || wishlist.items.length === 0 ? (
                <div className="product-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <Heart size={80} color="var(--border)" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Your Wishlist is Empty</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                        Save items you love by clicking the heart icon on any product
                    </p>
                    <Link to="/">
                        <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                            Start Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {wishlist.items.map((item) => (
                        <div
                            key={item.id}
                            className="product-card"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                gap: '1.5rem',
                                alignItems: 'center',
                                transition: 'all 0.3s'
                            }}
                        >
                            {/* Product Image */}
                            <Link to={`/product/${item.productId}`} style={{ flexShrink: 0 }}>
                                <div
                                    className="product-image-container"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    <img
                                        src={item.productImage || '/placeholder.png'}
                                        alt={item.productName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </Link>

                            {/* Product Details */}
                            <div style={{ flex: 1 }}>
                                <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {item.productName}
                                    </h3>
                                </Link>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                    {item.brandName}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                        ₹{item.productPrice.toLocaleString()}
                                    </p>
                                    {item.inStock ? (
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10B981',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 500
                                        }}>
                                            In Stock
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#EF4444',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 500
                                        }}>
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!item.inStock}
                                    className="btn-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: item.inStock ? 1 : 0.5,
                                        cursor: item.inStock ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => handleRemoveFromWishlist(item.productId)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        color: 'var(--text)',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#F43F5E';
                                        e.currentTarget.style.color = '#F43F5E';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.color = 'var(--text)';
                                    }}
                                >
                                    <Trash2 size={18} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
