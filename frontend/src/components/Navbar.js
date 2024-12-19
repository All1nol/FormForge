import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/';
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '2rem' }}>
      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/user">My Dashboard</Link></li>
            {userRole === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
            <li><a href="#" onClick={handleLogout}>Logout</a></li>
          </>
        ) : (
          <li><Link to="/login">Login/Register</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
