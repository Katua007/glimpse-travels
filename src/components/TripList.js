import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import TripCard from './TripCard';
import './TripList.css';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/trips`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTrips(data);
        } else {
          setTrips([]);
        }
      })
      .catch(error => {
        console.error('Error fetching trips:', error);
        setTrips([]);
      });
  }, []);

  const continents = {
    'South America': ['Peru', 'Brazil', 'Argentina', 'Chile'],
    'Africa': ['Kenya', 'Tanzania', 'South Africa', 'Morocco'],
    'Asia': ['Indonesia', 'Thailand', 'Japan', 'India'],
    'Europe': ['Italy', 'France', 'Spain', 'Greece'],
    'North America': ['USA', 'Canada', 'Mexico']
  };

  const getContinent = (destination) => {
    for (const [continent, countries] of Object.entries(continents)) {
      if (countries.includes(destination)) return continent;
    }
    return 'Other';
  };

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(trip => getContinent(trip.destination) === filter);

  return (
    <div className="trip-list-page">
      <div className="trip-list-header">
        <h1>🌍 Explore Amazing Destinations</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Destinations
          </button>
          {Object.keys(continents).map(continent => (
            <button
              key={continent}
              className={filter === continent ? 'active' : ''}
              onClick={() => setFilter(continent)}
            >
              {continent}
            </button>
          ))}
        </div>
      </div>
      
      <div className="trip-list-container">
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} continent={getContinent(trip.destination)} />
          ))
        ) : (
          <div className="no-trips">
            <p>No trips found for this category. Be the first to explore!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripList;