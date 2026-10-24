import React, { useState } from 'react';
import MediaDetails from './MediaDetails'; // Import the modal component

const MediaGrid = ({ items, mediaType = 'none', onRemoveItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleRemoveConfirm = () => {
    if (pendingRemoval && onRemoveItem) {
      onRemoveItem(pendingRemoval);
    }
    setPendingRemoval(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {items.map(item => {
        const itemKey = `${item.mediaType || item.mediatype || mediaType}-${item.id}`;
        const isPendingRemoval = pendingRemoval && `${pendingRemoval.mediaType || pendingRemoval.mediatype || mediaType}-${pendingRemoval.id}` === itemKey;

        return (
          <div key={itemKey} className="media-item rounded-lg overflow-hidden shadow-lg relative focus:outline-none group">
            <button type="button" className="block w-full text-left" onClick={() => openModal(item)}>
              <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-auto object-cover" />
              <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-75">
                <h4 className="text-white text-lg font-bold truncate">{item.title || item.name}</h4>
              </div>
            </button>

            {onRemoveItem && (
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingRemoval(item);
                  }}
                  className="bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 relative"
                  aria-label={`Remove ${item.title || item.name} from watch history`}
                  title={`Remove ${item.title || item.name} from watch history`}
                >
                  ×
                </button>
              </div>
            )}

            {isPendingRemoval && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-4 text-white shadow-2xl mx-4">
                  <p className="mb-3 text-sm text-gray-200">
                    Remove <span className="font-semibold text-white">{pendingRemoval.title || pendingRemoval.name}</span> from your watch history?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingRemoval(null)}
                      className="px-3 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveConfirm}
                      className="px-3 py-2 text-sm rounded bg-red-600 hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {modalOpen && <MediaDetails item={selectedItem} onClose={closeModal} mediaType={selectedItem.mediaType || mediaType} />}
    </div>
  );
};

export default MediaGrid;
