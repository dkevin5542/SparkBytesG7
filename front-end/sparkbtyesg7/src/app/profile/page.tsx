'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/profile.css';

const Profile: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<{ name: string; bio: string; interests: string } | null>(null);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
    if (!storedProfile.name) {
      // If no profile data is available, redirect to the create profile page
      router.push('/createprofile');
    } else {
      setProfileData(storedProfile);
    }
  }, []);

  if (!profileData) return null; 

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <p><strong>Name:</strong> {profileData.name}</p>
      <p><strong>Bio:</strong> {profileData.bio}</p>
      <p><strong>Interests:</strong> {profileData.interests}</p>
    </div>
  );
};

export default Profile;