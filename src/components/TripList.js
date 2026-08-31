import React, { useCallback, useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import client from '../api/client';
import TripCard from './TripCard';
import { Skeleton, ErrorState, EmptyState } from './ui';
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
        <h1>Explore the log</h1>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All destinations
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

      {status === 'loading' && (
        <div className="trip-list-container">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="trip-card-skeleton">
              <Skeleton height="12rem" radius="var(--radius-lg) var(--radius-lg) 0 0" />
              <div className="trip-card-skeleton-body">
                <Skeleton width="70%" height="1.25rem" />
                <Skeleton width="45%" height="1rem" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState message="Couldn't load trips. Check your connection and try again." onRetry={loadTrips} />
      )}

      {status === 'ready' && (
        filteredTrips.length > 0 ? (
          <div className="trip-list-container">
            {filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} continent={getContinent(trip.destination)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No trips in this category yet"
            message="Be the first to log one here."
            actionLabel="Create a trip"
            actionTo="/trips/new"
          />
        )
      )}
    </div>
  );
}

export default TripList;
