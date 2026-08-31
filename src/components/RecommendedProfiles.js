import React, { useCallback, useState, useEffect } from 'react';
import { Star, Landmark, Plane, Users as UsersIcon } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Skeleton, ErrorState, EmptyState } from './ui';
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
        <h2>Fellow travelers</h2>
        <div className="profiles-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="profile-card">
              <Skeleton width="3.75rem" height="3.75rem" radius="50%" />
              <Skeleton width="60%" height="1.25rem" style={{ marginTop: 'var(--space-sm)' }} />
              <Skeleton width="40%" height="1rem" style={{ marginTop: 'var(--space-2xs)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="recommended-profiles">
        <h2>Fellow travelers</h2>
        <ErrorState message="Couldn't load travel profiles. Check your connection and try again." onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="recommended-profiles">
      <h2>Fellow travelers</h2>
      {users.length > 0 ? (
        <div className="profiles-grid">
          {users.slice(0, 6).map(user => {
            const visitedCountries = getVisitedCountries(user.id);
            const wishlistCountries = getWishlistCountries(user.id);
            const trips = userTrips[user.id] || [];

            return (
              <div key={user.id} className="profile-card">
                <div className="rp-header">
                  <div className="rp-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="rp-info">
                    <h3>{user.username}</h3>
                    <div className="rp-rating">
                      <Star size={14} aria-hidden="true" fill="currentColor" /> {user.rating || 4.0}
                    </div>
                  </div>
                </div>

                <div className="rp-stats">
                  <div className="rp-stat">
                    <span className="rp-stat-number">{visitedCountries.length}</span>
                    <span className="rp-stat-label">Visited</span>
                  </div>
                  <div className="rp-stat">
                    <span className="rp-stat-number">{wishlistCountries.length}</span>
                    <span className="rp-stat-label">Planned</span>
                  </div>
                </div>

                <div className="countries-section">
                  <div className="countries-group">
                    <h4><Landmark size={13} aria-hidden="true" /> Been to</h4>
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

                  <div className="countries-group">
                    <h4><Plane size={13} aria-hidden="true" /> Planning to visit</h4>
                    <div className="countries-list">
                      {wishlistCountries.length > 0 ? (
                        wishlistCountries.slice(0, 3).map(country => (
                          <span key={country} className="country-tag wishlist">{country}</span>
                        ))
                      ) : (
                        <span className="no-countries">No future plans yet</span>
                      )}
                      {wishlistCountries.length > 3 && (
                        <span className="more-countries">+{wishlistCountries.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rp-actions">
                  {trips.length > 0 ? (
                    <Button to={`/trips/${trips[0].id}`} variant="secondary" className="rp-actions-btn">
                      View their trips
                    </Button>
                  ) : (
                    <span className="no-countries">No trips to show yet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={UsersIcon}
          title="No travel profiles yet"
          message="Be the first to join and start a log."
          actionLabel="Create an account"
          actionTo="/signup"
        />
      )}
    </div>
  );
}

export default RecommendedProfiles;
