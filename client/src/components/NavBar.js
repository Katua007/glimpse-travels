import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/trips">All Trips</NavLink>
      <NavLink to="/trips/new">Create Trip</NavLink>
      {/* Add more links as needed */}
    </nav>
  );
}

export default NavBar;