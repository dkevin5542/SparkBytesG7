'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/createprofile.css';

const CreateProfile: React.FC = () => {
  const router = useRouter();
  //add more fields if required
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    interests: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();

      if (data.success) {
        console.log('Profile created successfully');
        router.push('/home');
        //uncomment once profile page is created
        // router.push('/profile');

      } else {
        console.error('Failed to create profile:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-profile-container">
      <div className="create-profile-card">
        <h1>Create Your Profile</h1>
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
          {/*Follow this format to create new text inputs */}
          {/* <label>
            Interests:
            <input
              type="text"
              name="interests"
              value={profileData.interests}
              onChange={handleChange}
            />
          </label> */}
          <button type="submit">Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
