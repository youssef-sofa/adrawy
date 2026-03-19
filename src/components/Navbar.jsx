import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                <span>Mary Church</span>
            </div>
            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Gallery
                </NavLink>
                <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Add Image
                </NavLink>
                <span style={{ color: '#8b949e', marginLeft: '1rem', fontSize: '0.9rem' }}>{user.email}</span>
                <button onClick={handleLogout} className="btn-logout">
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
