import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TripDetail() {
  const [trip, setTrip] = useState(null);
  const { id } = useParams(); // Get the ID from the URL

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
}, [id]); // Dependency array ensures fetch runs only when 'id' changes

  if (!trip) {
    return <div>Loading...</div>; // Render a loading state
  }

  // Render the trip's details
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
  </div>
);
}

export default TripDetail;