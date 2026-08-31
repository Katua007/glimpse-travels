import React from 'react';
import Button from './Button';
import './EmptyState.css';

function EmptyState({ icon: Icon, title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} aria-hidden="true" className="empty-state-icon" />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && <Button to={actionTo}>{actionLabel}</Button>}
      {actionLabel && onAction && !actionTo && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

export default EmptyState;
