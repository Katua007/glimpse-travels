// client/src/components/PhotoForm.js

import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import client from '../api/client';
import { Input, Button, useToast } from './ui';
import './PhotoForm.css';

function PhotoForm({ tripId, onNewPhoto }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    client
      .post('/photos', { url, caption, trip_id: tripId })
      .then(newPhoto => {
        onNewPhoto(newPhoto);
        setUrl('');
        setCaption('');
        toast.show('Photo added.');
      })
      .catch(error => {
        console.error('Error adding photo:', error);
        toast.show(error.message || 'Could not add that photo.', { type: 'error' });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="photo-form">
      <h3><ImagePlus size={18} aria-hidden="true" /> Add a photo</h3>
      <Input
        id="photo-url"
        type="url"
        label="Photo URL"
        placeholder="https://…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <Input
        id="photo-caption"
        type="text"
        label="Caption (optional)"
        placeholder="Where was this taken?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add photo'}
      </Button>
    </form>
  );
}

export default PhotoForm;
