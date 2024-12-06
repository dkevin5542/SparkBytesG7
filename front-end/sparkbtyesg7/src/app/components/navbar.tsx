"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/navbar.css';

/**
 * Navbar Component
 *
 * Displays the navigation menu for the Spark Bytes application.
 * 
 * Purpose:
 * - Provides links for navigating between key pages.
 * - Uses Next.js's 'useRouter' for client-side navigation.
 *
 * Usage:
 * Included at the top of the application to give users an easy way to navigate the site.
 *
 * Features:
 * Each navigation link is represented as a button, and clicking on it will route the user to its page.
 *
 * Styling:
 * CSS from 'navbar.css' for layout and design.
 *
 * Functions:
 * 'handleNavigation': Redirects to the specified path using 'router.push'.
 */

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/google-logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for session handling
      });

      if (response.ok) {
        console.log('Logout successful');
        router.push('/login'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => handleNavigation('/')}>Spark Bytes</div>
      <ul className="navbar-links">
        <li><button onClick={() => handleNavigation('/')}>HOME</button></li>
        <li><button onClick={() => handleNavigation('/about')}>ABOUT</button></li>
        <li><button onClick={() => handleNavigation('/create-event')}>CREATE EVENT</button></li>
        <li><button onClick={() => handleNavigation('/contact')}>CONTACT</button></li>
        <li className="dropdown">
          <button className="dropdown-button" onClick={handleDropdownToggle}>
            PROFILE
          </button>
          {dropdownVisible && (
            <ul className="dropdown-menu">
              <li onClick={() => handleNavigation('/profile/edit_profile')}>EDIT PROFILE</li>
              <li onClick={() => handleNavigation('/profile/posted-events')}>POSTED EVENTS</li>
              <li onClick={() => handleNavigation('/favorites')}>FAVORITES</li>
              <li onClick={handleLogout}>LOGOUT</li> {/* Trigger logout */}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
