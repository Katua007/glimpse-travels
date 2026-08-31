import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import TripCard from './TripCard';
import './TripList.css';

const CONTINENTS = {
  'South America': ['Peru', 'Brazil', 'Argentina', 'Chile'],
  'Africa': ['Kenya', 'Tanzania', 'South Africa', 'Morocco'],
  'Asia': ['Indonesia', 'Thailand', 'Japan', 'India'],
  'Europe': ['Italy', 'France', 'Spain', 'Greece'],
  'North America': ['USA', 'Canada', 'Mexico']
};

function getContinent(destination) {
  for (const [continent, countries] of Object.entries(CONTINENTS)) {
    if (countries.includes(destination)) return continent;
  }
  return 'Other';
}

function TripList() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('loading'); // loading | error | ready

  const loadTrips = useCallback(() => {
    setStatus('loading');
    client
      .get('/trips')
      .then(data => {
        setTrips(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch(error => {
        console.error('Error fetching trips:', error);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

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
          {Object.keys(CONTINENTS).map(continent => (
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

      {status === 'loading' && <p className="loading">Loading trips…</p>}

      {status === 'error' && (
        <div className="no-trips">
          <p>Couldn't load trips. Check your connection and try again.</p>
          <button type="button" onClick={loadTrips}>Retry</button>
        </div>
      )}

      {status === 'ready' && (
        <div className="trip-list-container">
          {filteredTrips.length > 0 ? (
            filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} continent={getContinent(trip.destination)} />
            ))
          ) : (
            <div className="no-trips">
              <p>No trips found for this category yet.</p>
              <Link to="/trips/new">Create the first one</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TripList;
