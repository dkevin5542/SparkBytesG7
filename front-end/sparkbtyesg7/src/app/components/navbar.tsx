import React from 'react';
import '@/app/styles/navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Spark Bytes</div>
      <ul className="navbar-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Events</a></li>
        <li><a href="#">Create Event</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;