import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = size === 'large' ? 'h-16 w-16' : 'h-8 w-8';
  return (
    <div className={`animate-spin border-4 border-t-4 border-red-600 rounded-full ${sizeClasses} mx-auto`} />
  );
};

export default LoadingSpinner; 