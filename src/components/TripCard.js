import React from 'react';
import { Link } from 'react-router-dom';
import './TripCard.css';

function TripCard({ trip }) {
  if (!trip) {
    return null;
  }

  const imageUrl = trip.photos && trip.photos.length > 0 
    ? trip.photos[0].url 
    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop';

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop';
  };

  return (
    <div className="trip-card">
      <Link to={`/trips/${trip.id}`} className="trip-link">
        <div className="trip-image">
          <img 
            src={imageUrl} 
            alt={trip.title} 
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className="trip-content">
          <h3>{trip.title}</h3>
          <p className="destination">📍 {trip.destination}</p>
          <p className="date">📅 {new Date(trip.start_date).toLocaleDateString()}</p>
        </div>
      </Link>
    </div>
  );
}

export default TripCard;