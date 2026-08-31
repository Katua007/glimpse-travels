import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BlurImage } from './ui';
import './Photo.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop';

function Photo({ photo }) {
  const prefersReducedMotion = useReducedMotion();

  if (!photo) {
    return null;
  }

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  const itemVariant = prefersReducedMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className="photo" variants={itemVariant}>
      <BlurImage
        src={photo.url}
        alt={photo.caption || 'Travel photo'}
        onError={handleImageError}
      />
      {photo.caption && <p className="photo-caption">{photo.caption}</p>}
    </motion.div>
  );
}

export default Photo;
