// client/src/components/PhotoForm.js

import React, { useState } from 'react';
import client from '../api/client';

function PhotoForm({ tripId, onNewPhoto }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .post('/photos', { url, caption, trip_id: tripId })
      .then(newPhoto => {
        onNewPhoto(newPhoto); // Callback to update state in parent component
        setUrl('');
        setCaption('');
      })
      .catch(error => console.error('Error adding photo:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="photo-form">
      <h3>Add a New Photo</h3>
      <input
        type="text"
        placeholder="Photo URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button type="submit">Add Photo</button>
    </form>
  );
}

export default PhotoForm;