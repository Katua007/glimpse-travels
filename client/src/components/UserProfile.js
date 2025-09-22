// client/src/components/UserProfile.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const userId = 1; // NOTE: Replace with dynamic user ID from state or context

  useEffect(() => {
    fetch(`/users/${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('User not found');
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  }, [userId]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="user-profile">
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      
      <h2>My Trips</h2>
      <div className="my-trips-list">
        {user.trips.length > 0 ? (
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