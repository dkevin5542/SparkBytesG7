import React from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/navbar.css';

export const Navbar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => handleNavigation('/')}>Spark Bytes</div>
      <ul className="navbar-links">
        <li><a onClick={() => handleNavigation('/')}>Home</a></li>
        <li><a onClick={() => handleNavigation('/events')}>Events</a></li>
        <li><a onClick={() => handleNavigation('/create-event')}>Create Event</a></li>
        <li><a onClick={() => handleNavigation('/contact')}>Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;