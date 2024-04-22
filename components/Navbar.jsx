// Navbar.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Sidebar from './Sidebar';  // Adjust the path as necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
      </nav>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
