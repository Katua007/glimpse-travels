import React from 'react';
import './Photo.css';

function Photo({ photo }) {
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop';
  };

  return (
    <div className="photo">
      <img 
        src={photo.url} 
        alt={photo.caption || 'Travel photo'} 
        onError={handleImageError}
        loading="lazy"
      />
      {photo.caption && <p className="photo-caption">{photo.caption}</p>}
    </div>
  );
}

export default Photo;