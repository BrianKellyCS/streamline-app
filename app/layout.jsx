import '@styles/globals.css';
import Navbar from '@components/Navbar';
export const metadata = {
    title: "Streamline",
    description: 'Stream Movies & TV'
}

import React from 'react'

const RootLayout = ({children}) => {
  return (
    <html lang="en">
        <body>
            <div className="main">
            </div>
        <main className="app bg-black text-white min-h-screen">
            <Navbar />
            {children}
        </main>
        </body>
    </html>
  )
}

export default RootLayout


