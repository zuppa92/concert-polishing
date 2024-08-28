// src/components/NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContextProvider';
import '../styles/NavBar.css';

const NavBar = ({ logout }) => {
  const { user } = useUser();

  console.log("NavBar user:", user); // Debugging line

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/artists" className="nav-link">Artists</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
      </div>
      <div className="navbar-auth-section">
        {user && user.username ? (
          <div className="navbar-user-info">
            {user.profilePictureUrl && (
              <img src={user.profilePictureUrl} alt="Profile" className="navbar-profile-pic" />
            )}
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <div className="navbar-auth-links">
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link signup-link">Signup</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;