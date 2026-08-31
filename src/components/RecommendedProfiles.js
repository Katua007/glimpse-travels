import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import './RecommendedProfiles.css';

function RecommendedProfiles() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [userTrips, setUserTrips] = useState({});
  const [status, setStatus] = useState('loading'); // loading | error | ready

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const usersData = await client.get('/users');
      const otherUsers = Array.isArray(usersData)
        ? usersData.filter(user => user.id !== currentUser?.id)
        : [];
      setUsers(otherUsers);

      const tripsData = await client.get('/trips');
      const tripsByUser = {};
      if (Array.isArray(tripsData)) {
        tripsData.forEach(trip => {
          if (!tripsByUser[trip.user_id]) {
            tripsByUser[trip.user_id] = [];
          }
          tripsByUser[trip.user_id].push(trip);
        });
      }
      setUserTrips(tripsByUser);
      setStatus('ready');
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus('error');
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getVisitedCountries = (userId) => {
    const trips = userTrips[userId] || [];
    const pastTrips = trips.filter(trip => new Date(trip.end_date) < new Date());
    return [...new Set(pastTrips.map(trip => trip.destination))];
  };

  const getWishlistCountries = (userId) => {
    const trips = userTrips[userId] || [];
    const futureTrips = trips.filter(trip => new Date(trip.start_date) > new Date());
    return [...new Set(futureTrips.map(trip => trip.destination))];
  };

  if (status === 'loading') {
    return (
      <div className="recommended-profiles">
        <h2>🌟 Recommended Travel Profiles</h2>
        <div className="loading-profiles">Loading amazing travelers...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="recommended-profiles">
        <h2>🌟 Recommended Travel Profiles</h2>
        <div className="no-profiles">
          <p>Couldn't load travel profiles. Check your connection and try again.</p>
          <button type="button" onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommended-profiles">
      <h2>🌟 Recommended Travel Profiles</h2>
      <div className="profiles-grid">
        {users.length > 0 ? users.slice(0, 6).map(user => {
          const visitedCountries = getVisitedCountries(user.id);
          const wishlistCountries = getWishlistCountries(user.id);
          const trips = userTrips[user.id] || [];

          return (
            <div key={user.id} className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h3>{user.username}</h3>
                  <div className="rating">
                    {'⭐'.repeat(Math.floor(user.rating || 4))} {user.rating || 4.0}
                  </div>
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{visitedCountries.length}</span>
                  <span className="stat-label">Visited</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{wishlistCountries.length}</span>
                  <span className="stat-label">Wishlist</span>
                </div>
              </div>

              <div className="countries-section">
                <div className="visited-countries">
                  <h4>🏛️ Been To:</h4>
                  <div className="countries-list">
                    {visitedCountries.length > 0 ? (
                      visitedCountries.slice(0, 3).map(country => (
                        <span key={country} className="country-tag visited">{country}</span>
                      ))
                    ) : (
                      <span className="no-countries">No trips yet</span>
                    )}
                    {visitedCountries.length > 3 && (
                      <span className="more-countries">+{visitedCountries.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="wishlist-countries">
                  <h4>✈️ Wants to Visit:</h4>
                  <div className="countries-list">
                    {wishlistCountries.length > 0 ? (
                      wishlistCountries.slice(0, 3).map(country => (
                        <span key={country} className="country-tag wishlist">{country}</span>
                      ))
                    ) : (
                      <span className="no-countries">No future plans</span>
                    )}
                    {wishlistCountries.length > 3 && (
                      <span className="more-countries">+{wishlistCountries.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                {trips.length > 0 ? (
                  <Link to={`/trips/${trips[0].id}`} className="view-profile-btn">
                    View Their Trips
                  </Link>
                ) : (
                  <span className="no-countries">No trips to show yet</span>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="no-profiles">
            <p>No travel profiles found. Be the first to join our community!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendedProfiles;