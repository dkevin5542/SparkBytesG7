'use client';

import React, { useState, useEffect } from 'react';
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

const EditProfile: React.FC = () => {
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
  const [loading, setLoading] = useState(true);

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/get_profile', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data.');
        }

        if (data.profile) {
          setProfileData(data.profile);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    setErrorMessage(null); 
    try {
      const response = await fetch('http://localhost:5002/api/edit_profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(profileData),
      });

      const data = await response.json();  

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      if (data.success) {
        console.log('Profile updated successfully');
        router.push('/profile');  
      } else {
        setErrorMessage(data.message || 'Failed to update profile.');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  if (loading) {
    return (
      <div className="create-profile-container">
        <div className="create-profile-card">
          <h1>Loading...</h1>
          <p>Please wait while we load your profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-profile-container">
      <div className="create-profile-card">
        <h1>Edit Your Profile</h1>
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
              disabled  
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
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;