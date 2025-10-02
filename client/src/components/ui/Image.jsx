import React, { useState } from 'react';

const Image = ({ src, ...rest }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    console.error('[IMAGE] Failed to load image:', src);
    setError(true);
    setLoading(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-200 rounded-xl" {...rest}>
        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center bg-gray-200 rounded-xl" {...rest}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        </div>
      )}
      <img 
        src={src} 
        {...rest} 
        alt={''} 
        className="rounded-xl"
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </>
  );
};

export default Image;
