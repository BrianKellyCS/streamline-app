// Navbar.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-black text-white flex justify-between items-center p-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <button className="text-2xl" onClick={toggleSidebar}>☰</button>
          <Link href="/">
            <Image src="/assets/images/logo_orange.png" alt="Streamline Logo" width={150} height={200} className="ml-2 cursor-pointer" />
          </Link>
        </div>
        <div className="flex items-center relative">
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                <FontAwesomeIcon icon={faUser} size="2x" className="cursor-pointer ml-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 text-white rounded shadow-lg">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-800">
                    Logout
                  </button>
                </div>
              )}
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
