// Navbar.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSearchDropdown = () => {
    setSearchDropdownOpen(!searchDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSearchDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchQuery]);

  return (
    <>
      <nav className="bg-black text-white flex justify-between items-center p-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <button className="text-2xl" onClick={toggleSidebar}>☰</button>
          <Link href="/">
            <Image src="/assets/images/logo_orange.png" alt="Streamline Logo" width={150} height={200} className="ml-2 cursor-pointer" />
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center relative">
          <div className="hidden md:flex items-center w-full max-w-lg">
            <input
              type="text"
              className="flex-grow p-2 text-lg transition-colors duration-300 bg-black text-primary-orange focus:bg-place-black border border-gray-700 placeholder-hover-orange focus:outline-none"
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
          <button className="md:hidden" onClick={toggleSearchDropdown}>
            <FontAwesomeIcon icon={faSearch} size="lg" className="cursor-pointer ml-4" />
          </button>
          {searchDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-black border border-gray-700 text-white rounded shadow-lg z-10 p-2">
              <input
                type="text"
                className="w-full p-2 text-lg transition-colors duration-300 bg-black text-primary-orange focus:bg-place-black border border-gray-700 placeholder-hover-orange focus:outline-none"
                style={{ fontFamily: 'monospace' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={isFocused ? '' : 'search...'}
              />
              <button onClick={handleSearch} className="block w-full text-left px-4 py-2 hover:bg-gray-800">
                Search
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center relative">
          {user ? (
            <div className="relative flex items-center">
              <div>
                <span className="mr-2 text-primary-orange">{user.username}</span>
              </div>
              <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                <FontAwesomeIcon icon={faUser} size="2x" className="cursor-pointer ml-4 text-primary-orange" />
              </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 text-white rounded shadow-lg">
                    <Link href="/" passHref><button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-800">
                      Logout
                    </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login">
              <FontAwesomeIcon icon={faUser} size="2x" className="cursor-pointer ml-4" />
            </Link>
          )}
        </div>
      </nav>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
