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
 * - Provides users with navigation between key pages of the application.
 * - Supports client-side routing using Next.js's 'useRouter'.
 * - Includes session management functionality, such as user logout.
 * 
 * Usage:
 * - Included at the top of the application as a persistent navigation bar.
 * - Accessible on all pages to provide easy navigation and session actions.
 * 
 * Features:
 * - Displays navigation links as buttons for HOME, ABOUT, CREATE EVENT, and CONTACT pages.
 * - Includes a dropdown menu under 'PROFILE' with additional options:
 *   - Edit Profile
 *   - View Posted Events
 *   - View Favorites
 *   - Logout
 * - Logout functionality interacts with the server to end the user's session and redirects to the login page.
 * 
 * Styling:
 * - Custom CSS imported from 'navbar.css' for layout, design, and dropdown menu styling.
 * - Ensures a responsive design for various screen sizes.
 * 
 * Functions:
 * - 'handleNavigation': Redirects users to the specified path using 'router.push'.
 * - 'handleDropdownToggle': Toggles the visibility of the dropdown menu.
 * - 'handleLogout': Sends a POST request to the backend to log out the user and redirects to the login page on success.
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
