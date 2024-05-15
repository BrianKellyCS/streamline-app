import '@styles/globals.css';
import Navbar from '@components/Navbar';
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from '../context/AuthContext';
export const metadata = {
    title: "Streamline",
    description: 'Stream Movies & TV'
}

import React from 'react'

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="main"></div>
        <main className="app bg-black text-white min-h-screen">
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
          <Analytics />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;


