import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'student', label: 'Student Portal', path: '/student' },
    { id: 'professor', label: 'Professor Portal', path: '/professor' },
    { id: 'courses', label: 'Course Catalog', path: '/courses' },
    { id: 'clubs', label: 'Clubs', path: '/clubs' },
    { id: 'events', label: 'Events', path: '/events' },
    { id: 'profile', label: 'Profile', path: '/profile' },
  ];

  // Filter so student doesn't see professor portal and vice versa
  const filteredItems = navItems.filter(item => {
    if (userType === 'student') return item.id !== 'professor';
    if (userType === 'professor') return item.id !== 'student';
    return true;
  });

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">Campus Portal</div>
        <div className="navbar-links">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="nav-link"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { onLogout(); navigate('/login'); }}
            className="nav-link logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
