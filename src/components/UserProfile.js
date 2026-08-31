// client/src/components/UserProfile.js

import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PlusCircle, Map, Compass, Pencil } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Skeleton, ErrorState, EmptyState } from './ui';
import TripCard from './TripCard';
import './UserProfile.css';

function UserProfile() {
  const { user } = useAuth();
  const [userTrips, setUserTrips] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready

  const loadTrips = useCallback(() => {
    if (!user) return;
    setStatus('loading');
    client
      .get(`/users/${user.id}/trips`)
      .then(myTrips => {
        setUserTrips(myTrips);
        setStatus('ready');
      })
      .catch(error => {
        console.error('Error fetching trips:', error);
        setStatus('error');
      });
  }, [user]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  if (!user) {
    return null;
  }

  const totalPhotos = userTrips.reduce((sum, trip) => sum + (trip.photos?.length || 0), 0);
  const totalFollowers = userTrips.reduce((sum, trip) => sum + (trip.followers?.length || 0), 0);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-circle">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email"><Mail size={14} aria-hidden="true" /> {user.email}</p>
          <p className="profile-bio">{user.bio || 'Adventure seeker & travel enthusiast'}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{userTrips.length}</div>
          <div className="stat-label">Trips</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalPhotos}</div>
          <div className="stat-label">Photos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalFollowers}</div>
          <div className="stat-label">Followers</div>
        </div>
      </div>

      <div className="profile-actions">
        <Button to="/trips/new" icon={PlusCircle}>New trip</Button>
        <Button to="/trips" variant="secondary" icon={Map}>Explore trips</Button>
      </div>

      <div className="my-trips-section">
        <h2>My trips</h2>

        {status === 'loading' && (
          <div className="my-trips-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="trip-card-skeleton">
                <Skeleton height="12rem" />
                <div className="trip-card-skeleton-body">
                  <Skeleton width="70%" height="1.25rem" />
                  <Skeleton width="45%" height="1rem" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <ErrorState message="Couldn't load your trips. Check your connection and try again." onRetry={loadTrips} />
        )}

        {status === 'ready' && (
          userTrips.length > 0 ? (
            <div className="my-trips-grid">
              {userTrips.map(trip => (
                <div key={trip.id} className="my-trip-card">
                  <TripCard trip={trip} />
                  <Link to={`/trips/${trip.id}/edit`} className="my-trip-edit-link">
                    <Pencil size={14} aria-hidden="true" /> Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="No trips logged yet"
              message="Start documenting your travels by creating your first trip."
              actionLabel="Create your first trip"
              actionTo="/trips/new"
            />
          )
        )}
      </div>
    </div>
  );
}

export default UserProfile;
