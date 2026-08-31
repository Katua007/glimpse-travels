import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./NavBar.css";

const navLinkClass = ({ isActive }) => (isActive ? 'active' : '');

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">✈️ Glimpse Travels</NavLink>
        </div>

        <div className="navbar-links">
          <NavLink to="/" end className={navLinkClass}>🏠 Home</NavLink>
          <NavLink to="/trips" className={navLinkClass}>🗺️ Explore Trips</NavLink>

          {user ? (
            <div className="user-menu">
              <NavLink to="/trips/new" className={navLinkClass}>➕ Create Trip</NavLink>
              <NavLink to="/profile" className={navLinkClass}>👤 My Profile</NavLink>
              <button onClick={logout} className="logout-btn">🚪 Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className={navLinkClass}>🔑 Login</NavLink>
              <NavLink to="/signup" className={navLinkClass}>📝 Join Us</NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar
