import React, { useState } from 'react';
import MediaDetails from './MediaDetails'; // Import the modal component

const MediaGrid = ({ items, mediaType = 'none' }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {items.map(item => (
        <button key={item.id} className="media-item rounded-lg overflow-hidden shadow-lg relative focus:outline-none" onClick={() => openModal(item)}>
          <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-auto object-cover" />
          <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-75">
            <h4 className="text-white text-lg font-bold truncate">{item.title || item.name}</h4>
          </div>
        </button>
      ))}
      {modalOpen && <MediaDetails item={selectedItem} onClose={closeModal} mediaType={mediaType} />}
    </div>
  );
};

export default MediaGrid;
