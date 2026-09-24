import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container py-5 text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-2 fw-medium">{message}</p>
    </div>
  );
};

export default Loading;
