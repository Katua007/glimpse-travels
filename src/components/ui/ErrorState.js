import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import './ErrorState.css';

function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="error-state" role="alert">
      <AlertTriangle size={28} aria-hidden="true" className="error-state-icon" />
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
