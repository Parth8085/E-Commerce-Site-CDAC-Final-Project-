import { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [regularUser, setRegularUser] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Determine current scope based on URL
    const isAdminScope = location.pathname.startsWith('/admin');
    const user = isAdminScope ? adminUser : regularUser;

    useEffect(() => {
        // Load User Session
        const userToken = localStorage.getItem('user_token');
        const userData = localStorage.getItem('user_data');
        if (userToken && userData) {
            setRegularUser(JSON.parse(userData));
        }

        // Load Admin Session
        const adminToken = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');
        if (adminToken && adminData) {
            setAdminUser(JSON.parse(adminData));
        }

        // Legacy Support: Migrate 'token' to 'user_token' if exists
        const oldToken = localStorage.getItem('token');
        const oldUser = localStorage.getItem('user');
        if (oldToken && oldUser && !userToken) {
            localStorage.setItem('user_token', oldToken);
            localStorage.setItem('user_data', oldUser);
            setRegularUser(JSON.parse(oldUser));
            // Cleanup legacy
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        setLoading(false);
    }, []);

    const login = async (email, password, isConnectAdmin = false) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, ...userData } = response.data;

        if (isConnectAdmin) {
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_data', JSON.stringify(userData));
            setAdminUser(userData);
        } else {
            localStorage.setItem('user_token', token);
            localStorage.setItem('user_data', JSON.stringify(userData));
            setRegularUser(userData);
        }
        return userData;
    };

    const register = async (name, email, phoneNumber, password) => {
        const response = await api.post('/auth/register', { name, email, phoneNumber, password });
        return response.data;
    };

    const logout = () => {
        if (isAdminScope) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
            setAdminUser(null);
        } else {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_data');
            setRegularUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user, isAdminScope }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
