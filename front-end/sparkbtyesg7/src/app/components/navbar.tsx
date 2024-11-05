"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/navbar.css';

export const Navbar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => handleNavigation('/')}>Spark Bytes</div>
      <ul className="navbar-links">
        <li><button onClick={() => handleNavigation('/')}>Home</button></li>
        <li><button onClick={() => handleNavigation('/about')}>About</button></li>
        <li><button onClick={() => handleNavigation('/events')}>Events</button></li>
        <li><button onClick={() => handleNavigation('/create-event')}>Create Event</button></li>
        <li><button onClick={() => handleNavigation('/contact')}>Contact</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
