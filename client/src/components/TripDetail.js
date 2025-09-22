import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Photo from './Photo';
import { Link } from 'react-router-dom';
import TripFollowers from './TripFollowers';

function TripDetail() {
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
          throw new Error('Failed to delete trip');
        }
      })
      .catch(error => console.error('Error deleting trip:', error));
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

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

      <div className="actions">
        {/* Link to the edit form */}
        <Link to={`/trips/${id}/edit`}>
          <button>Edit Trip</button>
        </Link>
        {/* Delete button */}
        <button onClick={handleDelete}>Delete Trip</button>
      </div>
    </div>
  );
}

export default TripDetail;