// client/src/components/TripDetail.js

import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import Photo from './Photo';
import TripFollowers from './TripFollowers';
import PhotoForm from './PhotoForm';
import './TripDetail.css';

function TripDetail() {
  const [trip, setTrip] = useState(null);
  const [tripOwner, setTripOwner] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadTrip = useCallback(() => {
    let cancelled = false;
    setError(null);

    (async () => {
      try {
        const data = await client.get(`/trips/${id}`);
        if (cancelled) return;
        setTrip(data);
        const owner = await client.get(`/users/${data.user_id}`).catch(() => null);
        if (!cancelled) setTripOwner(owner);
      } catch (err) {
        console.error('Error fetching trip:', err);
        if (!cancelled) setError('Could not load this trip.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => loadTrip(), [loadTrip]);

  const handleAddPhoto = (newPhoto) => {
    setTrip(prevTrip => ({
      ...prevTrip,
      photos: [...(prevTrip.photos || []), newPhoto]
    }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }
    try {
      await client.delete(`/trips/${id}`);
      navigate('/trips');
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete trip. You might not have permission.');
    }
  };

  if (error) {
    return (
      <div className="trip-detail-page">
        <div className="no-photos">
          <p>{error}</p>
          <button type="button" onClick={loadTrip}>Retry</button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return <div className="loading">🌍 Loading adventure...</div>;
  }

  const isOwner = user && user.id === trip.user_id;
  const mainPhoto = trip.photos && trip.photos[0] ? trip.photos[0].url : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop';

  return (
    <div className="trip-detail-page">
      <div className="trip-hero">
        <div className="hero-image">
          <img src={mainPhoto} alt={trip.title} />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>{trip.title}</h1>
              <p className="destination">📍 {trip.destination}</p>
              <p className="dates">
                📅 {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="trip-content">
        <div className="trip-info">
          <div className="trip-owner">
            <div className="owner-avatar">
              {tripOwner?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="owner-details">
              <h3>{tripOwner?.username || 'Unknown User'}</h3>
              <div className="owner-rating">
                {'⭐'.repeat(Math.floor(tripOwner?.rating || 4))} {tripOwner?.rating || 4.0}
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="trip-actions">
              <Link to={`/trips/${id}/edit`} className="action-btn edit-btn">
                ✏️ Edit Trip
              </Link>
              <button onClick={handleDelete} className="action-btn delete-btn">
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        <div className="photos-section">
          <h2>📸 Trip Gallery</h2>
          <div className="photos-grid">
            {trip.photos && trip.photos.length > 0 ? (
              trip.photos.map(photo => (
                <Photo key={photo.id} photo={photo} />
              ))
            ) : (
              <div className="no-photos">
                <p>No photos yet. {isOwner ? 'Add some memories!' : 'Check back later for photos.'}</p>
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="add-photo-section">
              <PhotoForm tripId={trip.id} onNewPhoto={handleAddPhoto} />
            </div>
          )}
        </div>
        
        <TripFollowers tripId={trip.id} user={user} />
      </div>
    </div>
  );
}

export default TripDetail;