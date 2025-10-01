// client/src/components/PhotoForm.js

import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

function PhotoForm({ tripId, onNewPhoto }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        caption,
        trip_id: tripId
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to add photo');
        }
        return res.json();
      })
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