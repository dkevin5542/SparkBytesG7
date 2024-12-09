'use client';

/* Importing React and global CSS styles. */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/createprofile.css';

/**
 * CreateProfile Component
 *
 * Provides a form for users to create their profile in the application.
 * 
 * Purpose:
 * - Enables users to input their profile information, including name, bio, interests, BU ID, dietary preferences, and language.
 * - Sends the profile data to the backend for creation and handles success or error responses.
 * - Redirects the user to their profile page upon successful profile creation.
 * 
 * Features:
 * - Form inputs for profile details.
 * - Dynamic state updates for each input field to reflect the user's input.
 * - Displays error messages for invalid inputs or backend issues.
 * - Redirects the user to the profile page upon successful creation.
 * 
 * State:
 * - 'profileData': Stores the current values for the profile fields.
 * - 'errorMessage': Stores any error message to be displayed upon failure.
 * 
 * Functions:
 * - 'handleChange': Updates the corresponding field in 'profileData' when a user inputs data.
 * - 'handleDietChange': Adds or removes dietary preferences from the user's selections.
 * - 'handleSubmit': Validates and submits the form data to the backend, handles API responses, and manages navigation or error display.
 * 
 * Usage:
 * - This component is used on a profile creation page.
 * - Requires a backend API endpoint to handle the submitted data.
 * 
 * Styling:
 * - Uses custom styles from 'createprofile.css' for layout and design.
 * - Includes a card-style layout for the profile creation form.
 */

// Dietary preference options
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
    name: '',
    bio: '',
    interests: '',
    buID: '',
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

  // Toggles dietary preferences in the 'diet' field
  const handleDietChange = (option: string) => {
    setProfileData((prevData) => {
      const updatedDiet = prevData.diet.includes(option)
        ? prevData.diet.filter((item) => item !== option)  
        : [...prevData.diet, option];  
      return { ...prevData, diet: updatedDiet };
    });
  };

  // Submits the form data to the backend
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

      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create profile.');
      }

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
