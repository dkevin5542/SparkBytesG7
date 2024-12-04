"use client";

import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Google OAuth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="140220835320-hp2l5648gotpt7u322qks2eaf7k8ggvn.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5002/api/protected-route', {
      method: 'GET',
      credentials: 'include', // Include cookies for session handling
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Authenticated user:', data);
      return true; // User is authenticated
    } else {
      console.error('User not authenticated');
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Check if user already has a profile
export const checkProfile = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5002/api/has_profile', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Profile exists:', data.has_profile);
      return data.has_profile; // True if profile exists
    } else {
      console.error('Error checking profile existence');
      return false;
    }
  } catch (error) {
    console.error('Error checking profile:', error);
    return false;
  }
};

// Google Authentication Button Component
export const GoogleAuthButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication and profile existence on mount
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const hasProfile = await checkProfile();
        if (hasProfile) {
          console.log('User already has a profile');
          router.push('/profile'); // Redirect to profile page
        } else {
          console.log('User authenticated but needs to create a profile');
          router.push('/createprofile'); // Redirect to create profile page
        }
      }
    };
    checkAuthAndProfile();
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      const redirectAfterLogin = async () => {
        const hasProfile = await checkProfile();
        if (hasProfile) {
          router.push('/profile');
        } else {
          router.push('/createprofile');
        }
      };
      redirectAfterLogin();
    }
  }, [isLoggedIn, router]);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      console.error('No token received');
      setAuthError('No token received');
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.message === 'Login successful') {
        console.log('User logged in:', data);
        setIsLoggedIn(true);
      } else {
        console.error('Login failed:', data.message);
        setAuthError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAuthError('Error during login');
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    setAuthError('Login Failed');
  };

  return (
    <div className="google-login-button">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
      {authError && <p className="error-message">{authError}</p>}
    </div>
  );
};

