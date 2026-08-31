import React from 'react';
import './Skeleton.css';

function Skeleton({ width, height = '1em', radius, className = '', style = {}, ...rest }) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}

export default Skeleton;
