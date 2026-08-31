import React from 'react';
import { MapPinOff } from 'lucide-react';
import { EmptyState } from './ui';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <EmptyState
        icon={MapPinOff}
        title="Off the map"
        message="There's nothing at this address. The trip you're looking for may have been moved or deleted."
        actionLabel="Explore trips"
        actionTo="/trips"
      />
    </div>
  );
}

export default NotFound;
