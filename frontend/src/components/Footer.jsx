import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container" style={{ padding: '3rem 2rem 1rem' }}>
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* About Section */}
                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, var(--primary), #818CF8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700
                        }}>SmartKartStore</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Your trusted destination for premium electronics. Discover the latest mobiles, laptops, and accessories at unbeatable prices.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                color: 'white'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                color: 'white'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                color: 'white'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                <Instagram size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                color: 'white'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/mobiles', label: 'Mobiles' },
                                { to: '/laptops', label: 'Laptops' },
                                { to: '/accessories', label: 'Accessories' },
                                { to: '/compare', label: 'Compare Products' }
                            ].map(link => (
                                <li key={link.to} style={{ marginBottom: '0.5rem' }}>
                                    <Link to={link.to} style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Customer Service</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { to: '/cart', label: 'My Cart' },
                                { to: '/login', label: 'My Account' },
                                { label: 'Track Order' },
                                { label: 'Return Policy' },
                                { label: 'Privacy Policy' }
                            ].map((link, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                    {link.to ? (
                                        <Link to={link.to} style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            transition: 'color 0.3s'
                                        }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                                            {link.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Contact Us</h4>
                        <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                                <span>123 Tech Street, Mumbai, India</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Phone size={18} style={{ color: 'var(--primary)' }} />
                                <a href="tel:+911234567890" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                                    +91 123 456 7890
                                </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} style={{ color: 'var(--primary)' }} />
                                <a href="mailto:support@smartkartstore.com" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                                    support@smartkartstore.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '1.5rem',
                    marginTop: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.9rem'
                }}>
                    <div>
                        © {currentYear} SmartKartStore. All rights reserved.
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span style={{ cursor: 'pointer' }}>Terms & Conditions</span>
                        <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                        <span style={{ cursor: 'pointer' }}>Cookie Policy</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        We Accept
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {['Visa', 'Mastercard', 'PayPal', 'UPI', 'Net Banking'].map(method => (
                            <span key={method} style={{
                                padding: '0.4rem 1rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.7)'
                            }}>
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
