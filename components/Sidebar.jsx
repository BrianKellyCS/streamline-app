import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchGenres } from '../app/api';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [genres, setGenres] = useState([]);
  const [activeMediaType, setActiveMediaType] = useState('');
  const [showGenresMenu, setShowGenresMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

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

  const handleGenreClick = (genreId) => {
    toggleSidebar();
    setShowGenresMenu(false);
    router.push(`/${activeMediaType}/${genreId}`);
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
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, toggleSidebar]);

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-80 z-50`}>
      <aside className="w-80 h-full bg-black text-gray-400 p-5 space-y-4 text-lg overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <button className="text-3xl mb-5 text-gray-400" onClick={toggleSidebar}>✕</button>
        <ul className="space-y-3">
          <li><Link href="/" passHref><span onClick={toggleSidebar}>Home</span></Link></li>
          <li>
            <button className="w-full text-left" onClick={() => handleFetchGenres('movie')}>Movies</button>
            {activeMediaType === 'movie' && showGenresMenu && (
              <ul className="pl-6 space-y-2 text-primary-orange list-inside list-disc">
                {genres.map((genre) => (
                  <li key={genre.id}><button onClick={() => handleGenreClick(genre.id)}>{genre.name}</button></li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <button className="w-full text-left" onClick={() => handleFetchGenres('tv')}>Shows</button>
            {activeMediaType === 'tv' && showGenresMenu && (
              <ul className="pl-6 space-y-2 text-primary-orange list-inside list-disc">
                {genres.map((genre) => (
                  <li key={genre.id}><button onClick={() => handleGenreClick(genre.id)}>{genre.name}</button></li>
                ))}
              </ul>
            )}
          </li>
          <li><Link href="/top-rated" passHref><span onClick={toggleSidebar}>Top Rated</span></Link></li>
          {user && (
            <>
              <li><Link href="/my-playlist" passHref><span onClick={toggleSidebar}>My Playlist</span></Link></li>
              <li><Link href="/watch-history" passHref><span onClick={toggleSidebar}>Watch History</span></Link></li>
              <li><Link href="/account-settings" passHref><span onClick={toggleSidebar}>Account Settings</span></Link></li>
              <li><Link href="/" passHref><button onClick={logout} className="w-full text-left" passHref><span onClick={toggleSidebar}>Logout</span></button></Link></li>
            </>
          )}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
