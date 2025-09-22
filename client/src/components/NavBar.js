// In client/src/components/NavBar.js

import React from "react";
import { NavLink } from "react-router-dom";

// Receive user and onLogout as props
function NavBar({ user, onLogout }) {
  return (
    <header>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/trips">All Trips</NavLink>

        {user ? (
          // Authenticated User links
          <>
            <NavLink to="/trips/new">Create Trip</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          // Guest User links
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;