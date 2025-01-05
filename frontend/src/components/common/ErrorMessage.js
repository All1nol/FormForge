import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-lg" role="alert">
      <p className="font-bold">Error</p>
      <p className="text-sm">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 