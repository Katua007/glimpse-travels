import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>Page not found</h1>
      <p>There's nothing here. The trip you're looking for may have been moved or deleted.</p>
      <Link to="/trips">Explore trips</Link>
    </div>
  );
}

export default NotFound;
