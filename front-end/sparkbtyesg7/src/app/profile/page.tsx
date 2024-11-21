"use client";  

import React, { useState } from 'react';
import '@/app/styles/page.css';
import '@/app/styles/profile.css'; 
import Navbar from '../components/navbar';

/**
 * Profile Page Component
 *
 * Displays the user profile page.
 *
 * Features:
 * - Relies on the Navbar for navigation between profile-specific actions.
 * - Displays a welcome message or additional profile-specific content.
 *
 * Usage:
 * Serves as the landing page for user profile actions.
 */

const ProfilePage: React.FC = () => {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <h1>Welcome to Your Profile</h1>
          <p>Select an option from the profile dropdown in the navbar to manage your account.</p>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;