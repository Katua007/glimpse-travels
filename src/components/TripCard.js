import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import { BlurImage } from './ui';
import './TripCard.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop';

function tripDurationDays(trip) {
  if (!trip.start_date || !trip.end_date) return null;
  const ms = new Date(trip.end_date) - new Date(trip.start_date);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

function TripCard({ trip }) {
  if (!trip) {
    return null;
  }

  const imageUrl = trip.photos && trip.photos.length > 0 ? trip.photos[0].url : FALLBACK_IMAGE;
  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };
  const duration = tripDurationDays(trip);

  return (
    <div className="trip-card">
      <Link to={`/trips/${trip.id}`} state={{ preview: trip }} className="trip-link">
        <div className="trip-image">
          <BlurImage
            layoutId={`trip-photo-${trip.id}`}
            src={imageUrl}
            alt={trip.title}
            onError={handleImageError}
          />
        </div>
        <div className="trip-content">
          <h3>{trip.title}</h3>
          <p className="destination">
            <MapPin size={14} aria-hidden="true" /> {trip.destination}
          </p>
          <div className="trip-meta">
            <span className="date-stamp">
              <Calendar size={12} aria-hidden="true" />
              {new Date(trip.start_date).toLocaleDateString()}
            </span>
            {duration && <span className="duration-tick">{duration}d</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default TripCard;
