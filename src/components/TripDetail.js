// client/src/components/TripDetail.js

import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Calendar, Star, Pencil, Trash2, Camera } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BlurImage, Button, ErrorState, EmptyState, useToast } from './ui';
import Photo from './Photo';
import TripFollowers from './TripFollowers';
import PhotoForm from './PhotoForm';
import './TripDetail.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop';

function tripDurationDays(trip) {
  if (!trip?.start_date || !trip?.end_date) return null;
  const ms = new Date(trip.end_date) - new Date(trip.start_date);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

function TripDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [trip, setTrip] = useState(location.state?.preview?.id === Number(id) ? location.state.preview : null);
  const [tripOwner, setTripOwner] = useState(null);
  const [error, setError] = useState(null);

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
    if (!window.confirm('Delete this trip? Its photos and followers go with it.')) {
      return;
    }
    try {
      await client.delete(`/trips/${id}`);
      toast.show('Trip deleted.');
      navigate('/trips');
    } catch (err) {
      console.error('Error deleting trip:', err);
      toast.show('Could not delete this trip — you may not own it.', { type: 'error' });
    }
  };

  if (error) {
    return (
      <div className="trip-detail-page">
        <ErrorState message={error} onRetry={loadTrip} />
      </div>
    );
  }

  if (!trip) {
    return <div className="loading">Loading trip…</div>;
  }

  const isOwner = user && user.id === trip.user_id;
  const mainPhoto = trip.photos && trip.photos[0] ? trip.photos[0].url : FALLBACK_IMAGE;
  const duration = tripDurationDays(trip);

  return (
    <div className="trip-detail-page">
      <div className="trip-hero">
        <div className="hero-image">
          <BlurImage layoutId={`trip-photo-${trip.id}`} src={mainPhoto} alt={trip.title} />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>{trip.title}</h1>
              <div className="hero-meta">
                <span><MapPin size={16} aria-hidden="true" /> {trip.destination}</span>
                <span>
                  <Calendar size={16} aria-hidden="true" />
                  {new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()}
                </span>
                {duration && <span className="duration-tick">{duration} day{duration === 1 ? '' : 's'}</span>}
              </div>
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
              <h3>{tripOwner?.username || 'Unknown traveler'}</h3>
              <div className="owner-rating">
                <Star size={14} aria-hidden="true" fill="currentColor" /> {tripOwner?.rating ?? 4.0}
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="trip-actions">
              <Button to={`/trips/${id}/edit`} variant="secondary" icon={Pencil}>
                Edit trip
              </Button>
              <Button variant="danger" icon={Trash2} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="photos-section">
          <h2><Camera size={20} aria-hidden="true" /> Trip gallery</h2>
          {trip.photos && trip.photos.length > 0 ? (
            <motion.div
              className="photos-grid"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.05 } } }}
            >
              {trip.photos.map(photo => (
                <Photo key={photo.id} photo={photo} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon={Camera}
              title="No photos yet"
              message={isOwner ? 'Add the first one below.' : 'Check back later for photos.'}
            />
          )}

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
