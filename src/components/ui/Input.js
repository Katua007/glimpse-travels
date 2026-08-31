import React from 'react';
import './Input.css';

function Input({ label, id, error, icon: Icon, className = '', ...rest }) {
  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className="field-control">
        {Icon && <Icon size={16} className="field-icon" aria-hidden="true" />}
        <input id={id} className={`field-input ${Icon ? 'has-icon' : ''}`} {...rest} />
      </div>
      {error && <div className="field-error" role="alert">{error}</div>}
    </div>
  );
}

export default Input;
