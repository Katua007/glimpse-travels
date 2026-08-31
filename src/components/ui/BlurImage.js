import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BlurImage.css';

function BlurImage({ src, alt, className = '', layoutId, onError, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const imgClassName = `blur-image ${loaded ? 'is-loaded' : ''} ${className}`.trim();

  if (layoutId) {
    return (
      <motion.img
        layoutId={layoutId}
        src={src}
        alt={alt}
        className={imgClassName}
        onLoad={() => setLoaded(true)}
        onError={onError}
        loading="lazy"
        {...rest}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imgClassName}
      onLoad={() => setLoaded(true)}
      onError={onError}
      loading="lazy"
      {...rest}
    />
  );
}

export default BlurImage;
