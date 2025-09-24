// client/src/components/UserProfile.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function UserProfile({ user }) {
  const navigate = useNavigate();

  // If the user is not logged in, redirect them to the login page
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Render a message if user data is still being fetched or not available
  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="user-profile">
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      
      <h2>My Trips</h2>
      <div className="my-trips-list">
        {user.trips && user.trips.length > 0 ? (
          user.trips.map(trip => (
            <div key={trip.id} className="user-trip-card">
              <h3>{trip.title}</h3>
              <p>Destination: {trip.destination}</p>
              <Link to={`/trips/${trip.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>You haven't created any trips yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;