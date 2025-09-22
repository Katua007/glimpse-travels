import React from 'react';

function Photo({ photo }) {
  return (
    <div className="photo">
      <img src={photo.url} alt={photo.caption} />
      {photo.caption && <p>{photo.caption}</p>}
    </div>
  );
}

export default Photo;