// client/src/components/TripDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Photo from './Photo';
import TripFollowers from './TripFollowers';

function TripDetail({ user }) {
  const [trip, setTrip] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/trips/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Trip not found');
        }
        return response.json();
      })
      .then(data => setTrip(data))
      .catch(error => console.error('Error fetching trip:', error));
  }, [id]);

  const handleDelete = () => {
    fetch(`/trips/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          navigate('/trips');
        } else {
          // You could also show an error message to the user here
          console.error('Failed to delete trip. You might not have permission.');
        }
      })
      .catch(error => console.error('Error deleting trip:', error));
  };

  if (!trip) {
    return <div>Loading...</div>;
  }
  
  // Check if the current user is the owner of the trip
  const isOwner = user && user.id === trip.user_id;

  return (
    <div className="trip-detail">
      <h1>{trip.title}</h1>
      <p>Destination: {trip.destination}</p>
      <p>Dates: {trip.start_date} to {trip.end_date}</p>

      <div className="photos-container">
        {trip.photos.map(photo => (
          <Photo key={photo.id} photo={photo} />
        ))}
      </div>
      
      <TripFollowers tripId={trip.id} />

      {/* Conditionally render the actions */}
      {isOwner && (
        <div className="actions">
          <Link to={`/trips/${id}/edit`}>
            <button>Edit Trip</button>
          </Link>
          <button onClick={handleDelete}>Delete Trip</button>
        </div>
      )}
    </div>
  );
}

export default TripDetail;