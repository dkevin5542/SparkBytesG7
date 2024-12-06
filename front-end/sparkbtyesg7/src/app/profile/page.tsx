"use client";

import React, { useEffect, useState } from 'react';
import '@/app/styles/page.css';
import '@/app/styles/profile.css';
import Navbar from '../components/navbar';

/**
 * Profile Page Component
 *
 * Displays the user's profile information.
 *
 * Features:
 * - Relies on the Navbar for navigation between profile-specific actions.
 * - Fetches and displays user profile information dynamically.
 *
 * Usage:
 * Serves as the landing page for user profile actions.
 */

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null); // State to hold profile data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/get_profile', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data); // Save profile data to state
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };

    fetchProfileData();
  }, []);

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Loading...</h1>
          <p>Please wait while we load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Welcome, {profileData.name}!</h1>
        <p>Here is your profile information:</p>
        <ul>
          <li><strong>Name:</strong> {profileData.name}</li>
          <li><strong>Bio:</strong> {profileData.bio || 'N/A'}</li>
          <li><strong>Interests:</strong> {profileData.interests || 'N/A'}</li>
          <li><strong>BU ID:</strong> {profileData.buID}</li>
          <li><strong>Diet:</strong> {profileData.diet || 'N/A'}</li>
          <li><strong>Language:</strong> {profileData.language || 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
