
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Search, Menu, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const { itemsCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    SmartKartStore
                </Link>

                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit"><Search size={20} /></button>
                </form>

                <div className="nav-links desktop-only">
                    <Link to="/mobiles">Mobiles</Link>
                    <Link to="/laptops">Laptops</Link>
                    <Link to="/accessories">Accessories</Link>
                    <Link to="/compare">Compare</Link>
                    {user && <Link to="/my-orders">My Orders</Link>}
                </div>

                <div className="nav-actions">
                    {user && (
                        <Link to="/wishlist" className="icon-btn" title="Wishlist">
                            <Heart size={24} />
                        </Link>
                    )}
                    <Link to="/cart" className="icon-btn">
                        <ShoppingCart size={24} />
                        {itemsCount > 0 && <span className="badge">{itemsCount}</span>}
                    </Link>

                    {user ? (
                        <>
                            <span style={{ fontWeight: '500' }}>Hi, {user.name || user.Name}</span>
                            <button onClick={logout} className="icon-btn" title="Logout">
                                <LogOut size={24} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="icon-btn">
                            <UserIcon size={24} />
                        </Link>
                    )}

                    <button className="mobile-only icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="nav-links">
                    <Link to="/mobiles" className="nav-item">Mobiles</Link>
                    <Link to="/laptops" className="nav-item">Laptops</Link>
                    <Link to="/accessories" className="nav-item">Accessories</Link>
                    <Link to="/compare" className="nav-item">Compare</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
