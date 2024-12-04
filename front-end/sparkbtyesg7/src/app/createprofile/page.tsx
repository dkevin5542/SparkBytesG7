'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/createprofile.css';

const CreateProfile: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    interests: '',
    buID: '',
    diet: '',
    language: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear any previous error messages
    try {
      const response = await fetch('http://localhost:5002/api/create_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create profile.');
      }

      const data = await response.json();

      if (data.success) {
        console.log('Profile created successfully');
        router.push('/profile'); // Redirect to profile page
      } else {
        setErrorMessage(data.message || 'Failed to create profile.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="create-profile-container">
      <div className="create-profile-card">
        <h1>Create Your Profile</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Bio:
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows={4}
            />
          </label>
          <label>
            Interests:
            <input
              type="text"
              name="interests"
              value={profileData.interests}
              onChange={handleChange}
            />
          </label>
          <label>
            BU ID:
            <input
              type="text"
              name="buID"
              value={profileData.buID}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Diet:
            <input
              type="text"
              name="diet"
              value={profileData.diet}
              onChange={handleChange}
            />
          </label>
          <label>
            Language:
            <input
              type="text"
              name="language"
              value={profileData.language}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
