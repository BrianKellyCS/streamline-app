import React from 'react';

const MediaToggle = ({ onToggle, activeType }) => {
  return (
    <div className="toggle-container flex justify-center my-4">
      <button
        className={`toggle-btn px-6 py-2 text-sm font-medium rounded-l-lg ${activeType === 'movie' ? 'bg-primary-orange text-black' : 'bg-gray-800 text-white'}`}
        onClick={() => onToggle('movie')}>
        Movies
      </button>
      <button
        className={`toggle-btn px-6 py-2 text-sm font-medium rounded-r-lg ${activeType === 'tv' ? 'bg-primary-orange text-black' : 'bg-gray-800 text-white'}`}
        onClick={() => onToggle('tv')}>
        TV Shows
      </button>
    </div>
  );
};

export default MediaToggle;
