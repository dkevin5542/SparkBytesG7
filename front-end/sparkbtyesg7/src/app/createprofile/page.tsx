'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/createprofile.css';

const foodOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Soy-Free",
  "Halal",
  "Kosher",
  "Snacks",
  "Other",
];

const CreateProfile: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    bio: '',
    interests: '',
    diet: [] as string[],
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

  const handleDietChange = (option: string) => {
    setProfileData((prevData) => {
      const updatedDiet = prevData.diet.includes(option)
        ? prevData.diet.filter((item) => item !== option)
        : [...prevData.diet, option];
      return { ...prevData, diet: updatedDiet };
    });
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

      console.log('Profile created successfully');
      router.push('/profile'); // Redirect to profile page
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
          <div className="food-type-container">
            <label className="food-type-label">Dietary Preferences</label>
            <div className="food-type-options">
              {foodOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={profileData.diet.includes(option)}
                    onChange={() => handleDietChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
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
