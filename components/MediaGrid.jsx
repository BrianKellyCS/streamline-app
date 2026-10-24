import React, { useState } from 'react';
import MediaDetails from './MediaDetails';

const MediaGrid = ({ items, mediaType = 'none', onRemoveItem, onRemoveItems }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [pendingRemovalPosition, setPendingRemovalPosition] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const getItemKey = (item) => `${item.mediaType || item.mediatype || mediaType}-${item.id}`;

  const toggleSelect = (item) => {
    const itemKey = getItemKey(item);
    setSelectedKeys((current) =>
      current.includes(itemKey)
        ? current.filter((key) => key !== itemKey)
        : [...current, itemKey]
    );
  };

  const toggleSelectAll = () => {
    if (selectedKeys.length === items.length) {
      setSelectedKeys([]);
      return;
    }

    setSelectedKeys(items.map(getItemKey));
  };

  const openModal = (item) => {
    if (selectionMode) {
      toggleSelect(item);
      return;
    }

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
    setPendingRemovalPosition(null);
  };

  const handleRemoveClick = (event, item) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();

    setPendingRemoval(item);
    setPendingRemovalPosition({
      top: Math.min(window.innerHeight - 180, rect.top + 20),
      left: Math.max(16, rect.left - 180),
    });
  };

  const handleBulkRemoveConfirm = () => {
    if (!selectedKeys.length || !onRemoveItems) return;

    const selectedItems = items.filter((item) => selectedKeys.includes(getItemKey(item)));
    onRemoveItems(selectedItems);
    setSelectedKeys([]);
    setSelectionMode(false);
  };

  return (
    <>
      {(onRemoveItem || onRemoveItems) && (
        <div className="flex items-center justify-start gap-2 px-2 pb-3 sm:px-3">
          <button
            type="button"
            onClick={() => setSelectionMode((current) => !current)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10"
          >
            {selectionMode ? 'Done' : 'Select'}
          </button>

          {selectionMode && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-gray-200 hover:bg-black/60"
              >
                {selectedKeys.length === items.length ? 'Clear all' : 'Select all'}
              </button>

              {selectedKeys.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkRemoveConfirm}
                  className="rounded-full bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                >
                  Remove selected ({selectedKeys.length})
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 pt-0">
        {items.map((item) => {
          const itemKey = getItemKey(item);
          const isPendingRemoval = pendingRemoval && getItemKey(pendingRemoval) === itemKey;
          const isSelected = selectedKeys.includes(itemKey);

          return (
            <div
              key={itemKey}
              className={`media-item group relative overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10 transition ${
                isSelected ? 'ring-2 ring-orange-400' : ''
              }`}
            >
              <button type="button" className="block w-full text-left" onClick={() => openModal(item)}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/75 p-2">
                  <h4 className="truncate text-lg font-bold text-white">{item.title || item.name}</h4>
                </div>
              </button>

              {selectionMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item);
                  }}
                  className={`absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold shadow-lg ${
                    isSelected
                      ? 'border-orange-400 bg-orange-500 text-white'
                      : 'border-white/30 bg-black/60 text-white'
                  }`}
                  aria-label={isSelected ? `Deselect ${item.title || item.name}` : `Select ${item.title || item.name}`}
                  title={isSelected ? `Deselect ${item.title || item.name}` : `Select ${item.title || item.name}`}
                >
                  {isSelected ? '✓' : ''}
                </button>
              )}

              {onRemoveItem && !selectionMode && (
                <div className="absolute right-2 top-2 z-10">
                  <button
                    type="button"
                    onClick={(event) => handleRemoveClick(event, item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-xl text-white shadow-lg ring-1 ring-white/10 opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                    aria-label={`Remove ${item.title || item.name} from watch history`}
                    title={`Remove ${item.title || item.name} from watch history`}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pendingRemoval && pendingRemovalPosition && (
        <div
          className="fixed z-50 w-64 rounded-xl border border-white/10 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-sm"
          style={{
            top: `${pendingRemovalPosition.top}px`,
            left: `${pendingRemovalPosition.left}px`,
          }}
        >
          <p className="mb-3 text-sm leading-snug text-slate-200">
            Remove <span className="font-semibold text-white">{pendingRemoval.title || pendingRemoval.name}</span> from your watch history?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setPendingRemoval(null);
                setPendingRemovalPosition(null);
              }}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRemoveConfirm}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {modalOpen && <MediaDetails item={selectedItem} onClose={closeModal} mediaType={selectedItem.mediaType || mediaType} />}
    </>
  );
};

export default MediaGrid;
