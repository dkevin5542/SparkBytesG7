"use client"; //Using client-side features in Next.js

import React from 'react';
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

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => handleNavigation('/')}>Spark Bytes</div>
      <ul className="navbar-links">
        <li><button onClick={() => handleNavigation('/')}>HOME</button></li>
        <li><button onClick={() => handleNavigation('/about')}>ABOUT</button></li> {/* Corrected route */}
        <li><button onClick={() => handleNavigation('/create-event')}>CREATE EVENT</button></li>
        <li><button onClick={() => handleNavigation('/events')}>EVENTS</button></li>
        <li><button onClick={() => handleNavigation('/contact')}>CONTACT</button></li>
        {/* <li><button onClick={() => handleNavigation('/login')}>Login</button></li> */}

      </ul>
    </nav>
  );
};

/* Exporting to use in other parts of the application */
export default Navbar;