import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchGenres, fetchSearchResults } from '../app/api';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [genres, setGenres] = useState([]);
  const [activeMediaType, setActiveMediaType] = useState('');
  const [showGenresMenu, setShowGenresMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter(); // Use useRouter for navigation

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFetchGenres = useCallback(async (mediaType) => {
    if (mediaType === activeMediaType && showGenresMenu) {
      setShowGenresMenu(false);
      return;
    }
    try {
      const genresData = await fetchGenres(mediaType);
      setGenres(genresData.genres);
      setActiveMediaType(mediaType);
      setShowGenresMenu(true);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setGenres([]);
      setShowGenresMenu(false);
    }
  }, [activeMediaType, showGenresMenu]);

  const handleGenreClick = (genreId, genreName) => {
    toggleSidebar();
    setShowGenresMenu(false);
    router.push(`/${activeMediaType}/${genreId}`);
  };

  const handleSearch = () => {
    toggleSidebar();
    if (searchQuery.trim()) {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);

    }
};

  useEffect(() => {
    if (!isOpen) {
      setGenres([]);
      setActiveMediaType('');
      setShowGenresMenu(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        toggleSidebar();
      }
      else if (e.key === 'Enter') {
        handleSearch();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, toggleSidebar, searchQuery]);

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-80 z-50`}>
      <aside className="w-80 h-full bg-black text-gray-400 p-5 space-y-4 text-lg overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <button className="text-3xl mb-5 text-gray-400" onClick={toggleSidebar}>✕</button>
        <div className="flex items-center mb-5">
          <input
            type="text"
            className="flex-grow p-2 transition-colors duration-300 bg-black text-primary-orange focus:bg-place-black border border-gray-700 placeholder-hover-orange focus:outline-none"
            style={{ fontFamily: 'monospace' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? '' : 'search...'} 
          />
          <button onClick={handleSearch} className="ml-2 p-1 rounded bg-gray-800 text-primary-orange">
            →
          </button>
        </div>
        <ul className="space-y-3">
          <li><Link href="/" passHref><span onClick={toggleSidebar}>Home</span></Link></li>
          <li>
            <button className="w-full text-left" onClick={() => handleFetchGenres('movie')}>Movies</button>
            {activeMediaType === 'movie' && showGenresMenu && (
              <ul className="pl-6 space-y-2 text-primary-orange list-inside list-disc">
                {genres.map(genre => (
                  <li key={genre.id}><button onClick={() => handleGenreClick(genre.id, genre.name)}>{genre.name}</button></li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <button className="w-full text-left" onClick={() => handleFetchGenres('tv')}>Shows</button>
            {activeMediaType === 'tv' && showGenresMenu && (
              <ul className="pl-6 space-y-2 text-primary-orange list-inside list-disc">
                {genres.map(genre => (
                  <li key={genre.id}><button onClick={() => handleGenreClick(genre.id, genre.name)}>{genre.name}</button></li>
                ))}
              </ul>
            )}
          </li>
          <li><Link href="/top-picks" passHref><span onClick={toggleSidebar}>Top Picks</span></Link></li>
          <li><Link href="/recently-added" passHref><span onClick={toggleSidebar}>Recently Added</span></Link></li>
          <li><Link href="/my-playlist" passHref><span onClick={toggleSidebar}>My Playlist</span></Link></li>
          <li><Link href="/continue-watching" passHref><span onClick={toggleSidebar}>Continue Watching</span></Link></li>
          <li><Link href="/account-settings" passHref><span onClick={toggleSidebar}>Account Settings</span></Link></li>
          <li><Link href="/logout" passHref><span onClick={toggleSidebar}>Logout</span></Link></li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;

