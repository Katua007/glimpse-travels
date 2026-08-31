// client/src/components/UserProfile.js

import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const history = useHistory();
  const { user } = useAuth();
  const [userTrips, setUserTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalPhotos: 0, followers: 0 });

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }

    client
      .get(`/users/${user.id}/trips`)
      .then(myTrips => {
        setUserTrips(myTrips);
        const totalPhotos = myTrips.reduce((sum, trip) => sum + (trip.photos?.length || 0), 0);
        setStats({
          totalTrips: myTrips.length,
          totalPhotos,
          followers: myTrips.reduce((sum, trip) => sum + (trip.followers?.length || 0), 0)
        });
      })
      .catch(error => console.error('Error fetching trips:', error));
  }, [user, history]);

  if (!user) {
    return <div className="loading">Redirecting to login...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1>🌍 {user.username}</h1>
          <p className="profile-email">📧 {user.email}</p>
          <p className="profile-bio">Adventure seeker & travel enthusiast</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalTrips}</div>
          <div className="stat-label">Trips</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPhotos}</div>
          <div className="stat-label">Photos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.followers}</div>
          <div className="stat-label">Followers</div>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/trips/new" className="action-btn primary">
          ➕ Create New Trip
        </Link>
        <Link to="/trips" className="action-btn secondary">
          🗺️ Explore Trips
        </Link>
      </div>

      <div className="my-trips-section">
        <h2>🎨 My Adventures</h2>
        <div className="my-trips-grid">
          {userTrips.length > 0 ? (
            userTrips.map(trip => (
              <div key={trip.id} className="trip-card">
                <div className="trip-image">
                  <img 
                    src={trip.photos && trip.photos[0] ? trip.photos[0].url : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'} 
                    alt={trip.title}
                  />
                </div>
                <div className="trip-content">
                  <h3>{trip.title}</h3>
                  <p className="destination">📍 {trip.destination}</p>
                  <p className="date">📅 {new Date(trip.start_date).toLocaleDateString()}</p>
                  <div className="trip-actions">
                    <Link to={`/trips/${trip.id}`} className="view-btn">View Details</Link>
                    <Link to={`/trips/${trip.id}/edit`} className="edit-btn">Edit</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-trips">
              <div className="no-trips-icon">🌍</div>
              <h3>No adventures yet!</h3>
              <p>Start documenting your travels by creating your first trip.</p>
              <Link to="/trips/new" className="create-first-trip">
                Create Your First Trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;