import React from 'react';
import { Link } from 'react-router-dom';
import './TripCard.css';

function TripCard({ trip }) {
  // Use a conditional check to ensure trip data exists
  if (!trip) {
    return null;
  }

  return (
    <div className="trip-card">
      <Link to={`/trips/${trip.id}`}>
        <img src={trip.photos.length > 0 ? trip.photos[0].url : 'placeholder.jpg'} alt={trip.title} />
        <h2>{trip.title}</h2>
        <p>Destination: {trip.destination}</p>
        <p>Start Date: {trip.start_date}</p>
      </Link>
    </div>
  );
}

export default TripCard;