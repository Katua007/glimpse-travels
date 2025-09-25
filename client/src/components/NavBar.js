import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar({ user, onLogout }) {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">✈️ Glimpse Travels</NavLink>
        </div>
        
        <div className="navbar-links">
          <NavLink to="/" exact activeClassName="active">🏠 Home</NavLink>
          <NavLink to="/trips" activeClassName="active">🗺️ Explore Trips</NavLink>

          {user ? (
            <div className="user-menu">
              <NavLink to="/trips/new" activeClassName="active">➕ Create Trip</NavLink>
              <NavLink to="/profile" activeClassName="active">👤 My Profile</NavLink>
              <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" activeClassName="active">🔑 Login</NavLink>
              <NavLink to="/signup" activeClassName="active">📝 Join Us</NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar